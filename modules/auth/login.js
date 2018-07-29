const userDb = require('../../modules/models/user/UserDb');
const tokenVerifier = require('./tokenManager');

module.exports = {
    login
};

function login(req, callBack) {
    userDb.getUser(req.body, (err, user) => {
        if (user && user.length === 1) {
            tokenVerifier.generateToken(user, (err, token) => {
                const userDoc = user[0]._doc;
                const authenticatedUser = {
                    firstName: userDoc.firstName,
                    lastName: userDoc.lastName,
                    email: userDoc.email,
                    company: userDoc.company,
                    admin: userDoc.admin,
                    created_on: userDoc.created_on,
                    _id: userDoc._id
                };
                callBack(err, {user: authenticatedUser, token: token});
            });
        } else {
            callBack(err, "");
        }
    });
}
