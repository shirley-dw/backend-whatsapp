const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[0-9]{10,15}$/;

export const verifyString = (field_name, field_value) => {
    console.log(`Validando ${field_name}:`, field_value, "Tipo:", typeof field_value);
    if (!(typeof field_value === 'string')) {
        return {
            error: 'STRING_VALIDATION',
            message: `${field_name} debe ser un texto`,
        };
    }
    return null;
};

export const verifyMinLength = (field_name, field_value, minLength) => {
    console.log(`Validando ${field_name}:`, field_value, "Longitud:", field_value.length);
    if (!(field_value.length >= minLength)) {
        return {
            error: 'MIN_LENGTH_VALIDATION',
            message: `${field_name} debe tener como mínimo ${minLength} caracteres`,
        };
    }
    return null;  // Devuelve null si la validación pasa
};

export const verifyPhone = (field_name, field_value) => {
    if (!phoneRegex.test(field_value)) {
        return {
            error: 'PHONE_VALIDATION',
            message: `${field_name} no es un número de teléfono válido`,
        };
    }
    return null;  // Devuelve null si la validación pasa
};

export const verifyEmail = (field_name, field_value) => {
    if (!(emailRegex.test(field_value))) {
        return {
            error: 'EMAIL_VALIDATION',
            message: `${field_name} no cumple el formato email`
        };
    }
    return null;  // Devuelve null si la validación pasa
};

