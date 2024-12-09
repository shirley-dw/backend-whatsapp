# Lista de que haceres enlistados.

· Registro / autentificacion de mi proyecto:

- New user ingresa a la app: 
  1) Entra a el formulario de registro donde ingresara sus datos:
  * Name.
  * Email.
  * Password.

- El frontend enviara este form (mediante fetch) a nuestro server (/api/auth/register) MI ENDPOINT.

- El backend validara los datos enviados por el new user y si todo es correcto enviara al email registrado un correo de verificacion.
  1) Validar datos que vienen del form.
  2) Crear un token de validacion de email firmado con una clave secreta desde nuestro backend y lo enviara al email registrado.
  3) Se va a encriptar/hashear la password y se guardara en la Data Base.
  4) Guardamos en la DB al usuario.
  5) Respondo al front.

