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
    newUser.company = request.body.company;
    newUser.password = "password";
    UserModel.findOne({ email: newUser.email, admin: newUser.admin })
        .then(results => {
            if (results && !results.isNew) {
                callBack(null, {"message": "User already exists", status: 403})
            } else {
                newUser.save(function (err) {
                    if (err) {
                        callBack(err, {"message": "Failed to create new user", status: 500});
                    } else {
                        callBack(err, {"message": newUser, status: 200});
                    }
                });
            }
        });
}

function deleteUser(id, callBack) {
    UserModel.findOne({_id: id}).remove(callBack);
}