function soloAdministrador(req, res, next) {

    const rol = req.headers['rol'];

    if (rol !== 'administrador') {
        return res.status(403).json({
            error: 'Acceso permitido solamente a administradores'
        });
    }

    next();
}

module.exports = soloAdministrador;
