const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST || '192.168.100.1',
    user: process.env.DB_USER || 'capasapp',
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'capasAlmacen'
});

async function obtenerProductos() {
    const [result] = await connection.query(
        'SELECT * FROM producto'
    );
    return result;
}

async function crearProducto(
    tipo, marca, modelo, anio, precio, cantidad,
    descripcion, imagen, usuario_id
) {
    const [result] = await connection.query(
        `INSERT INTO producto
        (tipo, marca, modelo, anio, nombre, precio,
         cantidad, descripcion, imagen, usuario_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            tipo, marca, modelo, anio,
            `${tipo} ${marca} ${modelo} (${anio})`,
            precio, cantidad, descripcion, imagen || null,
            usuario_id
        ]
    );
    return result;
}

async function actualizarProducto(
    id, tipo, marca, modelo, anio, precio, cantidad,
    descripcion, imagen
) {
    const [result] = await connection.query(
        `UPDATE producto
         SET tipo = ?, marca = ?, modelo = ?, anio = ?,
             nombre = ?, precio = ?, cantidad = ?,
             descripcion = ?, imagen = ?
         WHERE id = ?`,
        [
            tipo, marca, modelo, anio,
            `${tipo} ${marca} ${modelo} (${anio})`,
            precio, cantidad, descripcion, imagen || null, id
        ]
    );
    return result;
}

async function eliminarProducto(id) {
    const [result] = await connection.query(
        'DELETE FROM producto WHERE id = ?',
        [id]
    );
    return result;
}

async function comprarProducto(id, usuario_id) {
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        const [vehiculos] = await conn.query(
            `SELECT id, precio, cantidad
             FROM producto
             WHERE id = ?
             FOR UPDATE`,
            [id]
        );

        if (vehiculos.length === 0) {
            await conn.rollback();
            return { error: 'El vehÃ­culo no existe' };
        }

        const vehiculo = vehiculos[0];

        if (vehiculo.cantidad <= 0) {
            await conn.rollback();
            return { error: 'El vehÃ­culo no estÃ¡ disponible' };
        }

        await conn.query(
            `UPDATE producto
             SET cantidad = cantidad - 1
             WHERE id = ?`,
            [id]
        );

        const [compra] = await conn.query(
            `INSERT INTO compra (usuario_id, vehiculo_id, precio)
             VALUES (?, ?, ?)`,
            [usuario_id, id, vehiculo.precio]
        );

        await conn.commit();

        return {
            mensaje: 'Compra realizada correctamente',
            id: compra.insertId
        };

    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    comprarProducto
};



