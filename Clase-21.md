Clase 21º 23/10/2024

# Temas:
· Creacion del todo.md documentacion de lo que necesito para iniciar mi  proyecto de register.
· Conexion con mongoDB
· Desarrollo del principio del autentificacion del user.
· Manejo de errores.
· Validaciones de email y password.


# Anotaciones:
· Sugiere siempre iniciar el proyecto con las cosas sencillas que si puedo hacer.
· Validaciones con expresiones regulares regex (Buscar mas info en el blog de regex).
· Controllers para manejar las verificaciones y validaciones.
· Routes para redirigir y mostrar los resultados.
· Encriptar / Hashear password.


_____________________________________________________________________________________________________________________________________________

# Mongoose:
 Es una herramienta esencial para los desarrolladores que trabajan con Node.js y MongoDB. Es un ODM (Object Data Modeling) que proporciona 
 una forma sencilla y robusta de interactuar con MongoDB, una base de datos NoSQL, usando esquemas y modelos.

* Características principales de Mongoose:
1) Modelado de Esquemas: Define la estructura y los tipos de datos que los documentos de tu base de datos deben seguir.
2) Validación: Permite aplicar reglas de validación sobre los datos antes de almacenarlos en la base de datos.
3) Plugins: Soporta la creación y uso de plugins para extender su funcionalidad.
4) Middlewares: Soporta middlewares (pre y post hooks) que permiten ejecutar funciones antes o después de ciertas operaciones.
5)Consultas y Actualizaciones: Facilita la creación de consultas y actualizaciones a la base de datos de manera sencilla y eficiente.

_____________________________________________________________________________________________________________________________________________

# Plugins:
 En el contexto de desarrollo de software, los plugins son módulos o componentes que se pueden agregar a una aplicación principal para ampliar
o modificar su funcionalidad sin alterar el código base. Los plugins son comúnmente utilizados en una variedad de entornos de software,
incluidos navegadores web, editores de texto, sistemas de gestión de contenido (CMS) y plataformas de desarrollo como Node.js y Mongoose.

* Características principales de los plugins:
1) Modularidad: Los plugins permiten añadir funcionalidades adicionales de manera modular, sin necesidad de modificar el código fuente original 
   de la aplicación.
2) Extensibilidad: Facilitan la extensibilidad de las aplicaciones, permitiendo a los desarrolladores agregar nuevas características o 
   personalizar el comportamiento de la aplicación.
3)Flexibilidad: Los plugins pueden ser activados, desactivados o reemplazados según las necesidades del usuario o del desarrollador.

_____________________________________________________________________________________________________________________________________________


//Logica de conexion a la base de datos en db.confing.js

// Importo mongoose
import mongoose from 'mongoose'

// Defino la URL de la base de datos esta la saco de la documentacion de mongoDBCOMPASS 
const MONGO_URL = 'mongodb://localhost:27017'

mongoose.connect(MONGO_URL, { //Operacion async 
    useNewUrlParser: true, // Usar el nuevo analizador de URL para evitar errores
    useUnifiedTopology: true // Usar el nuevo motor de administración de conexiones para mejor rendimiento y menos errores
});


# Mongoose:
Es un motor de base de datos utilizado para gestionar bases de datos relacionales, su ventaja es que permite crear modelos de datos
y realizar operaciones de manera sencilla. Para utilizarlo debo instalarlo y luego importarlo en el archivo config 


1) Creo una constante de conexion con la URL de la base de datos de mongoDBCOMPASS 
const MONGO_URL = 'mongodb://localhost:27017'

2) Conecto a la base de datos de mongoDBCOMPASS
* mongoose.connect:
Es el método que usas para conectarte a tu base de datos MongoDB usando Mongoose, que es una biblioteca de modelado de 
datos para MongoDB y Node.js. En tu código, estás proporcionando la URL de tu base de datos (MONGO_URL) y algunas opciones adicionales para 
la conexión.
- useNewUrlParser: true
Esta opción utiliza el nuevo analizador de URL para MongoDB. El nuevo analizador es más robusto y compatible con algunas características 
adicionales de MongoDB. Ayuda a evitar errores relacionados con la cadena de conexión que el analizador anterior podria no manejar 
adecuadamente.
- useUnifiedTopology: true
Esta opción habilita el nuevo motor de administración de conexiones de MongoDB. Ofrece un manejo más eficiente de las conexiones, 
mejor rendimiento y corrige varios problemas con el antiguo mecanismo de topología. También es necesario para habilitar algunas 
características como el monitoreo de servidores.


