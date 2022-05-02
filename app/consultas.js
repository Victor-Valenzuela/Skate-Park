const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    password: '123',
    database: 'skatepark',
});
async function consultarUsuarios() {
    try {
        const result = await pool.query(`SELECT * FROM skaters order by id`);
        return result.rows;
    } catch (e) {
        console.log(e);
    }
}
async function nuevoUsuario(email, nombre, password, experiencia, especialidad, foto) {
    try {
        const result = await pool.query(
            `INSERT INTO skaters
            (email,nombre,password,anos_experiencia,especialidad,foto,estado)
            VALUES ('${email}','${nombre}','${password}','${experiencia}','${especialidad}','${foto}',false) RETURNING *`);
        console.log(`Usuario ${result.rows[0].nombre} creado con éxito`);
        return result.rows;
    } catch (e) {
        console.log(e);
    }
}
async function updateStatus(id, estado) {
    try {
        const result = await pool.query(`UPDATE skaters SET estado = '${estado}' WHERE id = '${id}' RETURNING *`);
        console.log(`Estado del usuario ${result.rows[0].nombre} actualizado con éxito`);
        return result.rows;
    } catch (e) {
        console.log(e);
    }
}
async function getUsuario(email, password) {
    try {
        const result = await pool.query(`SELECT * FROM skaters WHERE email = '${email}' AND password = '${password}'`)
        return result.rows[0];
    } catch (e) {
        console.log(e);
    }
}
async function getFoto(email) {
    try {
        const result = await pool.query(`SELECT foto FROM skaters WHERE email = '${email}'`)
        return result.rows[0];
    } catch (e) {
        console.log(e);
    }
}
async function updateUsuario(email, nombre, password, experiencia, especialidad) {
    try {
        const result = await pool.query(`UPDATE skaters SET nombre = '${nombre}', password = '${password}', anos_experiencia = '${experiencia}', especialidad = '${especialidad}' WHERE email = '${email}' RETURNING *`);
        console.log(`Usuario ${result.rows[0].nombre} actualizado con éxito`);
        return result.rows;
    } catch (e) {
        console.log(e);
    }
}
async function deleteUsuario(email) {
    try {
        const result = await pool.query(`DELETE FROM skaters WHERE email = '${email}' RETURNING *`);
        console.log('Usuario eliminado con éxito');
        return result.rows;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { consultarUsuarios, nuevoUsuario, updateStatus, getUsuario, updateUsuario, deleteUsuario, getFoto }