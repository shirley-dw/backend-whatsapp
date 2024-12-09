import ResponseBuilder from "../src/helpers/builders/responseBuilder.js";
import User from "../src/models/user.model.js";

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtengo el usuario
    const user = await User.findById(id);

    // Construyo la respuesta con el usuario
    const response = new ResponseBuilder()
      .setCode("SUCCESS")
      .setOk(true)
      .setStatus(200)
      .setData(user)
      .build();

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    const response = new ResponseBuilder()
      .setOk(false)
      .setCode(500)
      .setMessage("Error al obtener el usuario")
      .build();
    return res.status(500).json(response);
  }
};
