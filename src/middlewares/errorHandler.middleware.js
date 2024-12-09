import AppError from "../helpers/errors/app.error";

const errorHandlerMiddleware = (error, req, res, next) => {
   error.statusCode = error.statusCode || 500
   error.status = error.status || 'error'
   if(error.is_operational) {
    res.status({
        status: error.status,
        message: error.message
    })
    console.error('ERROR: ', error.message)
    return res.status(500).json({ message: 'Error interno del servidor', error })
   }
}

export default errorHandlerMiddleware