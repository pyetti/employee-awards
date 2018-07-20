const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken,
    generateToken
};

const secretKey = 'secretKey';

function verifyToken(headers, callBack) {
    const bearerHeader = headers['authorization'];

    if (bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, secretKey, (err, authData) => {
            if (err) {
                callBack(err, '');
            } else {
                callBack(err, authData);
            }
        })
    }else {
        callBack('Bearer Header not sent', '');
    }
}

function generateToken(object, callBack) {
    jwt.sign({object}, secretKey, {expiresIn: '24h'}, (err, token) => {
        callBack(err, token);
    });
}
