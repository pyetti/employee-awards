let UserModel = require('./User.js');
const moment = require('moment');
const bcrypter = require('../../crypto/bcrypter');
const PImage = require('pureimage');
const arty = require('../../../art_signature/arty');
const fs = require('fs');

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
    const password = Math.random().toString(36).substring(2, 12);
    bcrypter.hash(password, (err, hash) => {
        if (err) {
            callBack(err, {"message": "Failed to create new user", status: 500});
            return;
        }
        const uModel = UserModel['users' + process.env.ENVIRONMENT];
        let newUser = new uModel();
        newUser.firstName = request.body.firstName;
        newUser.lastName = request.body.lastName;
        newUser.email = request.body.email;
        newUser.admin = request.body.admin !== '' ? request.body.admin : false;
        newUser.company = request.body.company;
        newUser.password = hash;
        newUser.created_on = moment().format('YYYY-MM-DD hh:mm:ss');

        const fnt = PImage.registerFont(arty.file_location, 'Arty Signature');
        fnt.load(() => {
            const signatureImage = PImage.make(200, 200);
            const ctx = signatureImage.getContext();
            ctx.fillStyle = '#000000';
            ctx.font = "64pt 'Arty Signature'";
            ctx.fillText(newUser.firstName + ' ' + newUser.lastName, 80, 80);
            PImage.encodePNGToStream(signatureImage, fs.createWriteStream('signature.png')).then(() => {
                console.log("wrote out the png file to signature.png");
            }).catch((err)=>{
                console.log("there was an error writing", err);
            });
        });

        uModel.findOne({ email: newUser.email })
            .then(results => {
                if (results && !results.isNew) {
                    callBack(null, {"message": "User already exists", status: 403})
                } else {
                    newUser.save(function (err) {
                        if (err) {
                            callBack(err, {"message": "Failed to create new user", status: 500});
                        } else {
                            newUser.password = password;
                            callBack(err, {"message": "User created. Email being sent to " + newUser.email, user: newUser,
                                status: 200});
                        }
                    });
                }
            });
        return hash;
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
