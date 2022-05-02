# Cierre Modulo 8 "Framework Express".

Habilidades a evaluar
- Crear una API REST con el Framework Express.
- Servir contenido dinámico con express-handlebars.
- Ofrecer la funcionalidad Upload File con express-fileupload.
- Implementar seguridad y restricción de recursos o contenido con JWT.

Descripción
La Municipalidad de Santiago, ha organizado una competencia de Skate para impulsar el nivel deportivo de los jóvenes que desean representar a Chile en los X Games del próximo año, y han iniciado con la gestión para desarrollar la plataforma web en la que los participantes se podrán registrar y revisar el estado de su solicitud.

En esta prueba deberás ocupar todos tus conocimientos para desarrollar un sistema que involucre tus habilidades como Full Stack Developer, consolidando tus competencias en el frontend y backend.

Las tecnologías y herramientas que deberás ocupar son las siguientes:
- Express.
- Handlebars.
- PostgreSQL.
- JWT.
- Express-fileupload.

A continuación, se muestra la interfaz gráfica:

![image](https://user-images.githubusercontent.com/96355317/166340242-5d9a0dd0-434f-428f-84b1-795f03ed6c83.png)

![image](https://user-images.githubusercontent.com/96355317/166340262-22336074-840c-42aa-b7b9-cd9d0b86a9e8.png)

![image](https://user-images.githubusercontent.com/96355317/166340277-e060ffda-61be-40f8-889d-282adbda985b.png)

![image](https://user-images.githubusercontent.com/96355317/166340311-6f354214-811d-4c73-9975-e33dcacc3132.png)

![image](https://user-images.githubusercontent.com/96355317/166340318-c1911a7e-a32c-4e5d-8b07-f489f7071d74.png)

Indicaciones:
- El sistema debe permitir registrar nuevos participantes.
- Se debe crear una vista para que los participantes puedan iniciar sesión con su correo y contraseña.
- Luego de iniciar la sesión, los participantes deberán poder modificar sus datos, exceptuando el correo electrónico y su foto. Esta vista debe estar protegida con JWT
y los datos que se utilicen en la plantilla deben ser extraídos del token.
- La vista correspondiente a la ruta raíz debe mostrar todos los participantes registrados y su estado de revisión.
- La vista del administrador debe mostrar los participantes registrados y permitir aprobarlos para cambiar su estado.

Se debe persistir la información de los usuarios en PostgreSQL, por lo que deberás usar las siguientes sentencias SQL para la creación de la base de datos y la tabla de participantes.

CREATE DATABASE skatepark;

CREATE TABLE skaters (id SERIAL, email VARCHAR(50) NOT NULL, nombre VARCHAR(25) NOT NULL, password VARCHAR(25) NOT NULL, anos_experiencia INT NOT NULL, especialidad VARCHAR(50) NOT NULL, foto VARCHAR(255) NOT NULL, estado BOOLEAN NOT NULL);

Requerimientos
1. Crear una API REST con el Framework Express. (3 Puntos)
2. Servir contenido dinámico con express-handlebars. (3 Puntos)
3. Ofrecer la funcionalidad Upload File con express-fileupload. (2 Puntos)
4. Implementar seguridad y restricción de recursos o contenido con JWT. (2 Puntos)
