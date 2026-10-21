const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        servicio: 'vehiculos',
        estado: 'activo',
        puerto: Number(process.env.PORT || 3011)
    });
});

// Rutas del catálogo y las compras de vehículos
app.use(require('./src/controllers/productosController'));

const PORT = process.env.PORT || 3011;

app.listen(PORT, '0.0.0.0', () => {
    console.log('vehiculos escuchando en el puerto ' + PORT);
});
