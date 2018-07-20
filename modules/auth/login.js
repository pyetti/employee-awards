const userDb = require('../../modules/models/user/UserDb');
const tokenVerifier = require('./tokenManager');

module.exports = {
    login
};

function login(req, callBack) {
    userDb.getUser(req.body, (err, user) => {
        if (user && user.length === 1) {
            tokenVerifier.generateToken(user, (err, token) => {
                callBack(err, token);
            });
        } else {
            callBack(err, "");
        }
    });
}
