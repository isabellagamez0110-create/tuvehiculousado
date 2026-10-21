const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        servicio: 'usuarios',
        estado: 'activo',
        puerto: Number(process.env.PORT || 3010)
    });
});

app.use(require('./src/controllers/usuariosController'));

const PORT = process.env.PORT || 3010;

app.listen(PORT, '0.0.0.0', () => {
    console.log('usuarios escuchando en el puerto ' + PORT);
});
