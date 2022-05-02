const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const secretKey = 'hola'
const { consultarUsuarios, nuevoUsuario, updateStatus, getUsuario, updateUsuario, deleteUsuario, getFoto } = require("./app/consultas");
const port = 3000;

app.listen(port, () => {
    console.log(`El servidor esta inicializado en el puerto ${port}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/public/assets/css'));
app.use(express.static(__dirname + '/public'));

app.use(expressFileUpload({
    limits: 5000000,
    abortOnLimit: true,
    responseOnLimit: 'El tamaño del archivo es demasiado grande'
}));

app.set('view engine', 'handlebars');

app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: 'main',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
        helpers: {
            math: function (lvalue, operator, rvalue) {
                lvalue = parseFloat(lvalue);
                rvalue = parseFloat(rvalue);
                return {
                    "+": lvalue + rvalue,
                }[operator];
            }
        }
    })
);

// Lista de participantes
app.get('/', async (_req, res) => {
    try {
        const usuarios = await consultarUsuarios()
        res.render('Index', { usuarios })
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

// Iniciar sesión
app.get('/login', (_req, res) => {
    res.render('Login');
})

// Registrarse
app.get('/registro', (_req, res) => {
    res.render('Registro');
})

// Vista administrador de estado
app.get('/admin', async (_req, res) => {
    try {
        const usuarios = await consultarUsuarios()
        res.render('Admin', { usuarios })
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

//Llamada a la API para obtener los datos de un usuario
app.get('/datos', (req, res) => {
    const { token } = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
        const { data } = decoded
        const email = data.email;
        const nombre = data.nombre;
        const password = data.password;
        const anos_experiencia = data.anos_experiencia;
        const especialidad = data.especialidad;
        err
            ? res.status(401).send({
                error: '401 Unauthorized',
                message: 'Usted no está autorizado para estar aquí',
                token_error: err.message,
            })
            : res.render('Datos', { email, nombre, password, anos_experiencia, especialidad })
    })
})

// Llamada a la API para registrar un nuevo usuario
app.post('/registrar', async (req, res) => {
    const { email, nombre, password, experiencia, especialidad } = req.body;
    const { foto } = req.files;
    const name = foto.name;
    try {
        const registro = await nuevoUsuario(email, nombre, password, experiencia, especialidad, name)
            .then(() => {
                foto.mv(`${__dirname}/public/uploads/${name}`, (err) => {
                    if (err) res.status(500).send("Error al subir la imagen");
                    res.status(201).redirect('/login');
                });
            })
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

// Llamada a la API para actualizar el estado de un usuario
app.put('/habilitar', async (req, res) => {
    const { id, estado } = req.body;
    try {
        const usuario = await updateStatus(id, estado);
        res.status(200).send(usuario);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

// llamada a la API para actualizar un usuario
app.put('/update', async (req, res) => {
    const { email, nombre, password, experiencia, especialidad } = req.body;
    try {
        const usuario = await updateUsuario(email, nombre, password, experiencia, especialidad);
        res.status(200).send(usuario);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

// llamada a la API para eliminar un usuario
app.delete('/delete/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const { foto } = await getFoto(email);
        const usuario = await deleteUsuario(email);
        fs.unlink(`${__dirname}/public/uploads/${foto}`, (err) => {
            if (err) console.log(err);
            res.status(200).send(usuario);
        });
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

// Verificacion del usuario y el token
app.post('/verify', async (req, res) => {
    const { email, password } = req.body;
    const usuario = await getUsuario(email, password)
    if (usuario) {
        if (usuario.estado) {
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 180,
                    data: usuario,
                },
                secretKey
            );
            res.send(token);
        } else {
            res.status(401).send({
                error: 'Este usuario aún no ha sido validado',
                code: 401,
            })
        }
    } else {
        res.status(404).send({
            error: 'Este usuario no está registrado en la base de datos o la contraseña es incorrecta.',
            code: 404,
        });
    }
});