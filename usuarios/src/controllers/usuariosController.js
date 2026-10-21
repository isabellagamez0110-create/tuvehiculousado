const express = require('express');
const router = express.Router();

const mysql = require('mysql2/promise');


// ==========================================
// CONEXIÃ“N A MYSQL
// ==========================================

const connection = mysql.createPool({

    host: process.env.DB_HOST || '192.168.100.1',

    user: process.env.DB_USER || 'capasapp',

    password: process.env.DB_PASSWORD,

    port: Number(process.env.DB_PORT || 3306),

    database: process.env.DB_NAME || 'capasAlmacen'

});


// ==========================================
// CREAR USUARIO
// ==========================================

router.post('/api/usuarios', async (req, res) => {

    try {

        const {
            nombre,
            correo,
            password,
            rol
        } = req.body;


        if (
            !nombre ||
            !correo ||
            !password ||
            !rol
        ) {

            return res.status(400).json({

                error:
                    'Todos los campos son obligatorios'

            });

        }


        // Verificar si ya existe el correo

        const [existentes] =
            await connection.execute(

                `
                SELECT id
                FROM usuario
                WHERE correo = ?
                `,

                [correo]

            );


        if (existentes.length > 0) {

            return res.status(400).json({

                error:
                    'Ya existe un usuario con ese correo'

            });

        }


        // Insertar usuario

        await connection.execute(

            `
            INSERT INTO usuario
            (
                nombre,
                correo,
                password,
                rol
            )
            VALUES (?, ?, ?, ?)
            `,

            [
                nombre,
                correo,
                password,
                rol
            ]

        );


        res.status(201).json({

            mensaje:
                'Usuario registrado correctamente'

        });


    } catch (error) {

        console.error(
            'Error al registrar usuario:',
            error
        );


        res.status(500).json({

            error:
                'Error al registrar usuario'

        });

    }

});


// ==========================================
// CONSULTAR TODOS LOS USUARIOS
// ==========================================

router.get('/api/usuarios', async (req, res) => {

    try {

        const [usuarios] =
            await connection.execute(

                `
                SELECT
                    id,
                    nombre,
                    correo,
                    rol
                FROM usuario
                ORDER BY id ASC
                `

            );


        res.status(200).json(usuarios);


    } catch (error) {

        console.error(
            'Error al consultar usuarios:',
            error
        );


        res.status(500).json({

            error:
                'Error al consultar usuarios'

        });

    }

});


// ==========================================
// VALIDAR CREDENCIALES
// IMPORTANTE: ESTA RUTA VA ANTES DE /:id
// ==========================================

router.get('/api/usuarios/validar', async (req, res) => {

    try {

        const {
            correo,
            password
        } = req.query;


        if (!correo || !password) {

            return res.status(400).json({

                error:
                    'Correo y contraseÃ±a son obligatorios'

            });

        }


        const [usuarios] =
            await connection.execute(

                `
                SELECT
                    id,
                    nombre,
                    correo,
                    rol
                FROM usuario
                WHERE correo = ?
                AND password = ?
                `,

                [
                    correo,
                    password
                ]

            );


        if (usuarios.length === 0) {

            return res.status(401).json({

                mensaje:
                    'Credenciales incorrectas'

            });

        }


        res.status(200).json({

            mensaje:
                'Credenciales correctas',

            usuario:
                usuarios[0]

        });


    } catch (error) {

        console.error(
            'Error al validar credenciales:',
            error
        );


        res.status(500).json({

            error:
                'Error al validar las credenciales'

        });

    }

});


// ==========================================
// CONSULTAR UN USUARIO
// ==========================================

router.get('/api/usuarios/:id', async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const [usuarios] =
            await connection.execute(

                `
                SELECT
                    id,
                    nombre,
                    correo,
                    rol
                FROM usuario
                WHERE id = ?
                `,

                [id]

            );


        if (usuarios.length === 0) {

            return res.status(404).json({

                error:
                    'Usuario no encontrado'

            });

        }


        res.status(200).json(
            usuarios[0]
        );


    } catch (error) {

        console.error(
            'Error al consultar usuario:',
            error
        );


        res.status(500).json({

            error:
                'Error al consultar usuario'

        });

    }

});


// ==========================================
// ACTUALIZAR USUARIO
// ==========================================

router.put('/api/usuarios/:id', async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const {
            nombre,
            correo,
            password,
            rol
        } = req.body;


        if (
            !nombre ||
            !correo ||
            !password ||
            !rol
        ) {

            return res.status(400).json({

                error:
                    'Todos los campos son obligatorios'

            });

        }


        // Verificar que el usuario exista

        const [existentes] =
            await connection.execute(

                `
                SELECT id
                FROM usuario
                WHERE id = ?
                `,

                [id]

            );


        if (existentes.length === 0) {

            return res.status(404).json({

                error:
                    'Usuario no encontrado'

            });

        }


        // Verificar que el correo no pertenezca
        // a otro usuario

        const [correoUsado] =
            await connection.execute(

                `
                SELECT id
                FROM usuario
                WHERE correo = ?
                AND id <> ?
                `,

                [
                    correo,
                    id
                ]

            );


        if (correoUsado.length > 0) {

            return res.status(400).json({

                error:
                    'Ese correo ya pertenece a otro usuario'

            });

        }


        await connection.execute(

            `
            UPDATE usuario
            SET
                nombre = ?,
                correo = ?,
                password = ?,
                rol = ?
            WHERE id = ?
            `,

            [
                nombre,
                correo,
                password,
                rol,
                id
            ]

        );


        res.status(200).json({

            mensaje:
                'Usuario actualizado correctamente'

        });


    } catch (error) {

        console.error(
            'Error al actualizar usuario:',
            error
        );


        res.status(500).json({

            error:
                'Error al actualizar usuario'

        });

    }

});


// ==========================================
// ELIMINAR USUARIO
// ==========================================

router.delete('/api/usuarios/:id', async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const [resultado] =
            await connection.execute(

                `
                DELETE FROM usuario
                WHERE id = ?
                `,

                [id]

            );


        if (
            resultado.affectedRows === 0
        ) {

            return res.status(404).json({

                error:
                    'Usuario no encontrado'

            });

        }


        res.status(200).json({

            mensaje:
                'Usuario eliminado correctamente'

        });


    } catch (error) {

        console.error(
            'Error al eliminar usuario:',
            error
        );


        res.status(500).json({

            error:
                'Error al eliminar usuario'

        });

    }

});


module.exports = router;



