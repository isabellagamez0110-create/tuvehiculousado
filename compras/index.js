const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        servicio: 'compras',
        estado: 'activo',
        puerto: Number(process.env.PORT || 3012)
    });
});

// Rutas para consultar y registrar compras
app.use(require('./src/controllers/comprasController'));

const PORT = process.env.PORT || 3012;

app.listen(PORT, '0.0.0.0', () => {
    console.log('compras escuchando en el puerto ' + PORT);
});
