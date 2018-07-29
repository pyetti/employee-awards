let UserModel = require('./User.js');
const moment = require('moment');

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
    const uModel = UserModel['users' + process.env.ENVIRONMENT];
    let newUser = new uModel();
    newUser.firstName = request.body.firstName;
    newUser.lastName = request.body.lastName;
    newUser.email = request.body.email;
    newUser.admin = request.body.admin;
    newUser.company = request.body.company;
    newUser.password = Math.random().toString(36).substring(2, 12);
    newUser.created_on = moment().format('YYYY-MM-DD hh:mm:ss');

    uModel.findOne({ email: newUser.email })
        .then(results => {
            if (results && !results.isNew) {
                callBack(null, {"message": "User already exists", status: 403})
            } else {
                newUser.save(function (err) {
                    if (err) {
                        callBack(err, {"message": "Failed to create new user", status: 500});
                    } else {
                        callBack(err, {"message": "User created. Email being sent to " + newUser.email, user: newUser,
                            status: 200});
                    }
                });
            }
        });
}

function update(user, callBack) {
    const uModel = UserModel['users' + process.env.ENVIRONMENT];
    uModel.findOneAndUpdate({email: user.email}, user, {new: true}, function(err, updatedUser) {
        if (err) {
            callBack(err, {status: 500, user: user});
        } else if (!updatedUser) {
            callBack(null, {status: 404, user: user});
        } else {
            callBack(null, {status: 200, user: updatedUser});
        }
    });
}

function deleteUser(id, callBack) {
    const uModel = UserModel['users' + process.env.ENVIRONMENT];
    uModel.findOne({_id: id}).remove(callBack);
}
