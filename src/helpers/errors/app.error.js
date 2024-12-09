class AppError extends Error {
    constructor(message, statusCode) {
        // Llama al constructor de la clase base (Error)
        super(message)

        // Asigna el código de estado HTTP
        this.statusCode = statusCode

        // Asigna el estado (fail para errores 4xx y error para otros)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

        // Indica que este es un error operacional (conocido)
        this.isOperational = true

        // Captura el stack trace sin incluir este constructor
        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError
