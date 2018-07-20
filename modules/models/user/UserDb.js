let UserModel = require('./User.js');

module.exports = {
    getUser: get,
    addUser: add,
    deleteUser: deleteUser
};

function get(query, callBack) {
    UserModel.find(query, function (err, users) {
        callBack(err, users);
    });
}

function add(request, callBack) {
    let newUser = new UserModel();
    newUser.firstName = request.body.firstName;
    newUser.lastName = request.body.lastName;
    newUser.email = request.body.email;
    newUser.admin = request.body.admin;
    UserModel.findOne({ firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, admin: newUser.admin })
        .then(results => {
            if (results && results.length > 0) {
                callBack(null, {"message": "User exists", status: 403})
            } else {
                newUser.save(function (err) {
                    callBack(err, {"message": newUser, status: 200});
                });
            }
        });
}

function deleteUser(id, callBack) {
    UserModel.findOne({_id: id}).remove(callBack);
}