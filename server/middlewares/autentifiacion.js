const jwt = require('jsonwebtoken');

let Autentificar = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.json({
                ok: false,
                message: 'Token invalido'
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

}

let verificaAdmin = (req, res, next) => {
    let role = req.usuario.role;

    if (role != 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: 'Solo los administradores puede hacer esta tarea'
        })
    }

    next();


}

module.exports = { Autentificar, verificaAdmin }