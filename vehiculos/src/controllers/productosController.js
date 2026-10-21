const { Router } = require('express');

const router = Router();

const productosModel = require('../models/productosModel');

const soloAdministrador = require('../middleware/adminMiddleware');


/* =========================
   CONSULTAR PRODUCTOS
   ========================= */

router.get('/api/productos', async (req, res) => {

    try {

        const productos =
            await productosModel.obtenerProductos();

        res.status(200).json(productos);

    } catch (error) {

        console.error(
            "Error al obtener productos:",
            error
        );

        res.status(500).json({
            error: "Error del servidor al obtener los productos"
        });

    }

});


/* =========================
   CREAR VEHÍCULO
   ========================= */

router.post(
    '/api/productos',
    async (req, res) => {

        try {

            const {
                tipo,
                marca,
                modelo,
                anio,
                precio,
                cantidad,
                descripcion,
                imagen
            } = req.body;
             const usuario_id = req.body.usuario_id;

            await productosModel.crearProducto(
                tipo,
                marca,
                modelo,
                anio,
                precio,
                cantidad,
                descripcion,
             imagen,
             usuario_id
            );

            res.status(201).json({
                mensaje: 'Vehículo creado correctamente'
            });

        } catch (error) {

            console.error(
                "Error al insertar vehículo:",
                error
            );

            res.status(500).json({
                error: "Error del servidor al insertar el vehículo"
            });

        }

    }
);


/* =========================
   ACTUALIZAR VEHÍCULO
   ========================= */

router.put(
    '/api/productos/:id',
    soloAdministrador,
    async (req, res) => {

        try {

            const { id } = req.params;

            const {
                tipo,
                marca,
                modelo,
                anio,
                precio,
                cantidad,
                descripcion,
                imagen
            } = req.body;


            await productosModel.actualizarProducto(
                id,
                tipo,
                marca,
                modelo,
                anio,
                precio,
                cantidad,
                descripcion,
                imagen
            );


            res.status(200).json({
                mensaje: 'Vehículo actualizado correctamente'
            });


        } catch (error) {

            console.error(
                "Error al actualizar vehículo:",
                error
            );

            res.status(500).json({
                error: "Error del servidor al actualizar el vehículo"
            });

        }

    }
);


/* =========================
   ELIMINAR VEHÍCULO
   ========================= */

router.delete(
    '/api/productos/:id',
    soloAdministrador,
    async (req, res) => {

        try {

            const { id } = req.params;

            await productosModel.eliminarProducto(id);


            res.status(200).json({
                mensaje: 'Vehículo eliminado correctamente'
            });


        } catch (error) {

            console.error(
                "Error al eliminar vehículo:",
                error
            );

            res.status(500).json({
                error: "Error del servidor al eliminar el vehículo"
            });

        }

    }
);


/* =========================
   COMPRAR VEHÍCULO
   ========================= */

router.post('/api/productos/:id/comprar', async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id } = req.body;

        if (!usuario_id) {
            return res.status(400).json({
                error: 'Falta el identificador del comprador'
            });
        }

        const resultado =
            await productosModel.comprarProducto(id, usuario_id);

        if (resultado.error) {
            return res.status(400).json({
                error: resultado.error
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error('Error al comprar vehículo:', error);

        return res.status(500).json({
            error: 'Error del servidor al realizar la compra'
        });
    }
});

module.exports = router;
