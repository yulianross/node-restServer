const jwt = require('jsonwebtoken');

// ===========================
// verificar token
// ===========================

const verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'token no válido',
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

// ===========================
// verificar token
// ===========================

const verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'no tienes permisos de administtrador para esta operación'
        });
    } 
};

// ===========================
// verificar token
// ===========================

const verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'token no válido',
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}