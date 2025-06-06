// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db-usuario'
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
});

// --- Rutas (Endpoints) para los Usuarios ---

// 1. Obtener todos los usuarios (READ ALL)
app.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT * FROM registro_usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(results); 
    });
});

// 2. Obtener un usuario por ID (READ ONE)
app.get('/api/usuarios/:id_usuario', (req, res) => { 
    const { id_usuario } = req.params; 
    const sql = 'SELECT * FROM registro_usuarios WHERE id_usuario = ?'; 
    db.query(sql, [id_usuario], (err, result) => {
        if (err) {
            console.error('Error al obtener usuario por ID:', err);
            return res.status(500).json({ error: 'Error al obtener usuario' });
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.json(result[0]);
        }
    });
});

// 3. Crear un nuevo usuario (CREATE)
app.post('/api/usuarios', (req, res) => {
    const newUser = req.body;
    const { nombre, apellido, fecha_nacimiento, sexo, cedula, email } = newUser;

    if (!nombre || !apellido || !cedula || !email) {
        return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
    }

    const sql = 'INSERT INTO registro_usuarios (nombre, apellido, fecha_nacimiento, sexo, cedula, email) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [nombre, apellido, fecha_nacimiento, sexo, cedula, email];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al crear usuario:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Cédula o Email ya existen.' });
            }
            return res.status(500).json({ error: 'Error al crear usuario' });
        }

        res.status(201).json({ id_usuario: result.insertId, ...newUser }); 
    });
});

// 4. Actualizar un usuario existente (UPDATE)
app.put('/api/usuarios/:id_usuario', (req, res) => { 
    const { id_usuario } = req.params; 
    const updatedUser = req.body;
    const { nombre, apellido, fecha_nacimiento, sexo, cedula, email } = updatedUser;

    if (!nombre || !apellido || !cedula || !email) {
        return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
    }

    const sql = 'UPDATE registro_usuarios SET nombre = ?, apellido = ?, fecha_nacimiento = ?, sexo = ?, cedula = ?, email = ? WHERE id_usuario = ?'; // ¡Cambio aquí!
    const values = [nombre, apellido, fecha_nacimiento, sexo, cedula, email, id_usuario]; 

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Cédula o Email ya existen para otro usuario.' });
            }
            return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.json({ message: 'Usuario actualizado', affectedRows: result.affectedRows });
        }
    });
});

// 5. Eliminar un usuario (DELETE)
app.delete('/api/usuarios/:id_usuario', (req, res) => { 
    const { id_usuario } = req.params; 
    const sql = 'DELETE FROM registro_usuarios WHERE id_usuario = ?'; 
    db.query(sql, [id_usuario], (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.json({ message: 'Usuario eliminado', affectedRows: result.affectedRows });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});