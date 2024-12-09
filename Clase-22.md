Clase 22º 28/10/2024

# Temas: 
· Encripto contraseña node.bcrypt.js framework



# Documentacion:
· Encripto contraseña node.bcrypt.js framework.


# Anotaciones:

______________________________________________________________________________________________________________________________________________

# bcryptjs:  
Es una biblioteca de JavaScript para Node.js que se utiliza para encriptar contraseñas y otros datos sensibles.
 Es conocida por su simplicidad y seguridad, ya que usa el algoritmo de hash bcrypt que es resistente a los ataques de fuerza bruta.

* Características principales:
1) Encriptación segura: Utiliza bcrypt, que añade sal (salt) para proteger contra ataques de diccionario.
2) Compatibilidad: Compatible con múltiples versiones de Node.js.
3)Facilidad de uso: Muy sencillo de integrar en proyectos de Node.js.

* Instalación: Primero, instala bcryptjs en tu proyecto:  
  npm install bcryptjs

- Ejemplo de uso básico:
Encriptar una contraseña: Aquí se muestra como encriptar y comparar una contraseña usando bcryptjs:

const bcrypt = require('bcryptjs');

// Encriptar contraseña
const password = 'myPlaintextPassword';
const saltRounds = 10;

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
            throw err;
        }

        console.log('Hashed Password:', hash);

        // Comparar contraseña
        bcrypt.compare(password, hash, function(err, result) {
            if (err) {
                throw err;
            }

            console.log('Password Match:', result); // true
        });
    });
});


* Explicación:
genSalt: Genera una sal (salt) con un número especificado de rondas.
hash: Crea un hash de la contraseña utilizando la sal generada.
compare: Compara una contraseña con un hash para verificar si coinciden.