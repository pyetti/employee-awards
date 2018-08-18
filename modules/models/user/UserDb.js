let UserModel = require('./User.js');
const moment = require('moment');
const bcrypter = require('../../crypto/bcrypter');
const formidable = require('formidable');
const image = require('./image');

module.exports = {
    getUser: get,
    addUser: add,
    updateUser: update,
    deleteUser: deleteUser
};

function get(query, callBack) {
    const uModel = UserModel['users' + process.env.ENVIRONMENT];
    uModel.find(query, function (err, users) {
        callBack(err, users);
    });
}

function add(request, callBack) {
    const form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        const password = Math.random().toString(36).substring(2, 12);
        bcrypter.hash(password, (err, hash) => {
            if (err) {
                callBack(err, {"message": "Failed to create new user", status: 500});
                return;
            }
            image.multer.single('image');
            request.file = files.signature_image;
            image.sendUploadToGCS(request);

            if (request.file.cloudStorageError) {
                console.log("Failed ot upload image file");
            }

            const uModel = UserModel['users' + process.env.ENVIRONMENT];
            let newUser = new uModel();
            newUser.firstName = fields.firstName;
            newUser.lastName = fields.lastName;
            newUser.email = fields.email;
            newUser.admin = fields.admin !== '' ? fields.admin : false;
            newUser.company = fields.company;
            newUser.password = hash;
            newUser.created_on = moment().format('YYYY-MM-DD hh:mm:ss');
            newUser.signature_image = image.getPublicUrl();

            uModel.findOne({email: newUser.email})
                .then(results => {
                    if (results && !results.isNew) {
                        callBack(null, {"message": "User already exists", status: 403})
                    } else {
                        // https://medium.com/@alvenw/how-to-store-images-to-mongodb-with-node-js-fb3905c37e6d
                        newUser.save(function (err) {
                            if (err) {
                                callBack(err, {"message": "Failed to create new user", status: 500});
                            } else {
                                newUser.password = password;
                                callBack(err, {
                                    "message": "User created. Email being sent to " + newUser.email, user: newUser,
                                    status: 200
                                });
                            }
                        });
                    }
                });
            return hash;
        });
    });
}

function update(user, callBack) {
    if (user.password) {
        bcrypter.hash(user.password, (err, hash) => {
            if (err) {
                callBack(err, {status: 500, message: "Failed to update user"})
            } else {
                user.password = hash;
                _update(user, callBack);
            }
        })
    } else {
        _update(user, callBack);
    }
}

function _update(user, callBack) {
    const uModel = UserModel['users' + process.env.ENVIRONMENT];
    uModel.findOneAndUpdate({email: user.email}, user, {new: true}, function (err, updatedUser) {
        if (err) {
            callBack(err, {status: 500, message: "Failed to update user"});
        } else if (!updatedUser) {
            callBack(null, {status: 404, message: "User not found"});
        } else {
            delete updatedUser.password;
            callBack(null, {status: 200, user: updatedUser});
        }
    });
}

function deleteUser(id, callBack) {
    const uModel = UserModel['users' + process.env.ENVIRONMENT];
    uModel.findOne({_id: id}).remove(callBack);
}
