const { Router } = require('express');
const mysql = require('mysql2/promise');

const router = Router();

const connection = mysql.createPool({
    host: process.env.DB_HOST || '192.168.100.1',
    user: process.env.DB_USER || 'capasapp',
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'capasAlmacen'
});


/* =========================
   CONSULTAR VENTAS
   ========================= */

router.get('/api/compras', async (req, res) => {

    try {

        const [compras] = await connection.execute(`
SELECT
    c.id,
    c.usuario_id,
    c.vehiculo_id,
    c.precio,
    c.fecha,
    p.nombre AS vehiculo_nombre,
    p.usuario_id AS vendedor_id
FROM compra c
INNER JOIN producto p
    ON p.id = c.vehiculo_id
ORDER BY c.fecha DESC
        `);

        res.status(200).json(compras);

    } catch (error) {

        console.error(
            'Error al obtener compras:',
            error
        );

        res.status(500).json({
            error: 'Error del servidor al obtener las compras'
        });

    }

});


/* =========================
   REGISTRAR VENTA
   ========================= */

router.post('/api/compras', async (req, res) => {

    try {

        const {
            usuario_id,
            vehiculo_id,
            precio
        } = req.body;

        if (!usuario_id || !vehiculo_id || precio === undefined) {

            return res.status(400).json({
                error: 'usuario_id, vehiculo_id y precio son obligatorios'
            });

        }

        await connection.execute(
            `
            INSERT INTO compra
            (
                usuario_id,
                vehiculo_id,
                precio
            )
            VALUES (?, ?, ?)
            `,
            [
                usuario_id,
                vehiculo_id,
                precio
            ]
        );

        res.status(201).json({
            mensaje: 'Venta registrada correctamente'
        });

    } catch (error) {

        console.error(
            'Error al registrar venta:',
            error
        );

        res.status(500).json({
            error: 'Error del servidor al registrar la venta'
        });

    }

});


module.exports = router;



