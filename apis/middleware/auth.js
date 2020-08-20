var jwt = require('jsonwebtoken');

module.exports = (req, res , next) => {

    try{
        console.log(req.headers); // req.headers for get request
        var token = req.headers.authorization.split(' ')[1]
        var decodeData = jwt.verify(token, 'secretfixedkey')
        req.decodeData = decodeData
        next();
    }catch(err){
        res.status(401).json({
            error:'Invalid token'
        })
    }
}
