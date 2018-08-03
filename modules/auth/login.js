const userDb = require('../../modules/models/user/UserDb');
const tokenVerifier = require('./tokenManager');
const bcrypter = require('./bcrypter');

module.exports = {
    login
};

function login(req, callBack) {
    const email = {email: req.body.email};
    userDb.getUser(email, (async (err, user) => {
        if (user && user.length === 1) {
            bcrypter.compare(req.body.password, user[0].password, (err, match) => {
                if (err) {
                    callBack("bcrypt failed", {status: 403, message: "Please try again"});
                    return;
                }
                if (!match) {
                    callBack("Password Mismatch", {status: 403, message: "Invalid credentials"});
                    return;
                }
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
            });
        } else {
            callBack(err, "Password Mismatch", {status: 403, message: "Invalid credentials"});
        }
    }));
}
