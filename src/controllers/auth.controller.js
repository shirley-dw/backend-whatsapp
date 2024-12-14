import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import ENVIROMENT from "../config/enviroment.js";
import ResponseBuilder from "../helpers/builders/responseBuilder.js";
import trasporterEmail from "../helpers/emailTransporter.helpers.js";
import {
  verifyEmail,
  verifyMinLength,
  verifyString,
} from "../helpers/validations.helpers.js";
import UserRepository from "../repositories/user.repository.js";

export const registerController = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const registerConfig = {
      name: {
        value: name,
        errors: [],
        validation: [
          verifyString,
          (field_name, field_value) =>
            verifyMinLength(field_name, field_value, 5),
        ],
      },
      password: {
        value: password,
        errors: [],
        validation: [
          verifyString,
          (field_name, field_value) =>
            verifyMinLength(field_name, field_value, 10),
        ],
      },
      email: {
        value: email,
        errors: [],
        validation: [
          verifyEmail,
          (field_name, field_value) =>
            verifyMinLength(field_name, field_value, 10),
        ],
      },
    };

    let hayErrores = false;
    for (let field_name in registerConfig) {
      for (let validation of registerConfig[field_name].validation) {
        let result = validation(field_name, registerConfig[field_name].value);
        if (result) {
          hayErrores = true;
          registerConfig[field_name].errors.push(result);
        }
      }
    }

    if (hayErrores) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setCode("VALIDATION_ERROR")
        .setData({
          registerState: registerConfig,
        })
        .build();
      return res.json(response);
    }

    const hashedPassword = await bcrypt.hash(registerConfig.password.value, 10);

    const validationToken = jwt.sign(
      {
        email: registerConfig.email.value,
      },
      ENVIROMENT.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    // Utiliza la URL de BACKEND_URL
    const redirectUrl = `${ENVIROMENT.BACKEND_URL}/api/auth/verify-email/${validationToken}`;

    // Enviar correo de verificación
    try {
      await trasporterEmail.sendMail({
        subject: "Valida tu email",
        to: registerConfig.email.value,
        html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <div style="text-align: center; padding: 20px; background-color: #f0f0f0;">
                        <h1 style="color: #4CAF50;">¡Verificación de Email!</h1>
                    </div>
                    <div style="padding: 20px; background-color: #fff;">
                        <p>Hola,</p>
                        <p>Gracias por registrarte en nuestra aplicación. Para completar tu registro y empezar a utilizar todos nuestros servicios, necesitamos que verifiques tu dirección de email. Esto nos ayuda a asegurarnos de que realmente eres tú.</p>
                        <p style="text-align: center;">
                            <a href='${redirectUrl}' style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                                Verificar Email
                            </a>
                        </p>
                        <p>Si no te registraste en nuestra aplicación, puedes ignorar este email.</p>
                        <p>Gracias,<br/>El equipo de WhatsApp Clone</p>
                    </div>
                    <div style="text-align: center; padding: 10px; background-color: #f0f0f0;">
                        <p style="font-size: 12px; color: #777;">Este email fue enviado a ${registerConfig.email.value}. Si tienes alguna pregunta, <a href="mailto:whatsappvalidationtoken@gmail.com">contáctanos</a>.</p>
                    </div>
                </div>
            `,
      });
    } catch (emailError) {
      console.error("Error al enviar el correo:", emailError);
      const response = new ResponseBuilder()
        .setOk(false)
        .setCode(500)
        .setMessage("Error al enviar correo de verificación")
        .setData({
          detail: "No se pudo enviar el correo de verificación",
        })
        .build();
      return res.json(response);
    }

    // Crear usuario en la base de datos
    await UserRepository.createUser({
      name: registerConfig.name.value,
      email: registerConfig.email.value,
      password: hashedPassword,
      verificationToken: "",
    });

    const response = new ResponseBuilder()
      .setCode("SUCCESS")
      .setOk(true)
      .setStatus(200)
      .setData({ registerResult: registerConfig })
      .build();

    return res.json(response);
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    if (error.code === 11000) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setCode(400)
        .setMessage("Email no se pudo registrar")
        .setData({
          detail: "El email ya está registrado",
        })
        .build();
      return res.json(response);
    }
    console.error(error);
    const response = new ResponseBuilder()
      .setOk(false)
      .setCode(500)
      .setMessage("Error interno del servidor")
      .setData({
        detail: "Ocurrió un error en el servidor",
      })
      .build();
    return res.json(response);
  }
};


export const verifyEmailController = async (req, res) => {
  try {
    const { validation_token } = req.params;

    if (!validation_token) {
      return res.status(400).json({ message: 'Token de validación no proporcionado' });
    }

    let payload;
    try {
      payload = jwt.verify(validation_token, ENVIROMENT.SECRET_KEY);
    } catch (err) {
      return res.status(400).json({ message: 'Token de validación mal formado' });
    }

    const email_to_verify = payload.email;
    const user_to_verify = await UserRepository.findUserByEmail(email_to_verify); // Usamos el repositorio

    if (!user_to_verify) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user_to_verify.emailVerified = true;
    await user_to_verify.save();

    res.redirect(`${ENVIROMENT.FRONTEND_URL}/verify-email/${validation_token}`);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      const response = new ResponseBuilder()
        .setCode(400) // Cambiado a número de código de estado HTTP
        .setOk(false)
        .setMessage("Email no encontrado")
        .build();
      return res.json(response);
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      const response = new ResponseBuilder()
        .setCode(401) // Código de error para contraseña inválida
        .setOk(false)
        .setMessage("Password inválida")
        .build();
      return res.json(response);
    }

    if (!user.emailVerified) {
      const response = new ResponseBuilder()
        .setCode(403) // Código de error para email no verificado
        .setOk(false)
        .setMessage("Email no verificado")
        .build();
      return res.json(response);
    }

    // Actualizar el estado del usuario a "online"
    user.status = "online";
    user.lastActive = Date.now();
    await user.save();

    // Generar el token JWT con el user_id
    const token = jwt.sign(
      { user_id: user._id.toString(), name: user.name, email: user.email },  // Genera el token
      ENVIROMENT.SECRET_KEY,
      {
        expiresIn: "1d",  // El token expirará en 1 día
      }
    );


    // Responder con éxito
    const response = new ResponseBuilder()
      .setCode(200) // Código de estado HTTP para éxito
      .setOk(true)
      .setMessage("Exitosamente autenticado") // Mensaje correcto
      .setData({ token: token, userId: user._id.toString() }) // Asegúrate de devolver el ID como string si es necesario
      .build();

    return res.json(response);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    const response = new ResponseBuilder()
      .setCode(500) // Código de error para servidor
      .setOk(false)
      .setMessage("Algo salió mal")
      .build();
    return res.json(response);
  }
};


export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar al usuario por email
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Crear un token de restablecimiento de contraseña
    const reset_token = jwt.sign({ email: user.email }, ENVIROMENT.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Construir la URL de restablecimiento de contraseña
    const resetUrl = `${ENVIROMENT.FRONTEND_URL}/forgot-password/${reset_token}`;

    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: ENVIROMENT.EMAIL_USER,
        pass: ENVIROMENT.EMAIL_PASSWORD,
      },
    });

    // Configurar las opciones de correo
    const mailOptions = {
      from: ENVIROMENT.EMAIL_USER,
      to: user.email,
      subject: "Recuperar Contraseña",
      text: `Has solicitado un restablecimiento de contraseña. Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo de recuperación de contraseña enviado" });
  } catch (error) {
    console.error("Error en forgotPasswordController:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const recoveryPasswordController = async (req, res) => {
  try {
    const { password, reset_token } = req.body;

    const decoded = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY);

    const user = await UserRepository.findUserByEmail(decoded.email); // Usamos el repositorio
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    const resetUrl = `${ENVIROMENT.FRONTEND_URL}/login`;
    res.status(200).json({
      message: "Contraseña restablecida correctamente",
      redirectUrl: resetUrl,
    });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

export const logoutController = async (req, res) => {
  try {
    const { user_id } = req.body;
    await UserRepository.updateUserStatus(user_id, "offline");
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const userInformationIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserRepository.findUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};