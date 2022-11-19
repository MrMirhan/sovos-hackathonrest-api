const { verifyJWT } = require('../lib/utils')

async function authenticateToken(req, res, next) {
    let token = req.headers['authorization']
    if (token == null) return res.status(401).json({
        message: "No token given!"
    });
    token = token.replace('Bearer ', '')
    if (token == null) return res.status(401).json({
        message: "No token given!"
    });

    let data = await verifyJWT(token)
    if (!data || data == false) return res.status(403).json({
        message: "Your token credentials are wrong!"
    });

    req.data = data
    next()
}

module.exports.authenticateToken = authenticateToken;