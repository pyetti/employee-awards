let UserModel = require('./User.js');

module.exports = {
    getUser: get,
    addUser: add,
    deleteUser: deleteUser
};

function get(request, callBack) {
    UserModel.find(request.query, function (err, data) {
        callBack(err, data);
    });
}

function add(request, callBack) {
    let newUser = new UserModel();
    newUser.firstName = request.body.firstName;
    newUser.lastName = request.body.lastName;
    newUser.email = request.body.email;
    newUser.admin = request.body.admin;
    UserModel.find({ firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, admin: newUser.admin })
        .then(results => {
            if (results.length > 0) {
                callBack(null, {"message": "User exists", status: 403})
            } else {
                newUser.save(function (err) {
                    callBack(err, {"message": newUser, status: 200});
                });
            }
        });
}

function deleteUser(id, callBack) {
    UserModel.find({_id: id}).remove(callBack);
}