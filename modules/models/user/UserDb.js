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
    if (request.body.proto) {
        callBack("", {"fail": "stop sending proto!"})
    }
    newUser.save(function (err) {
        callBack(err, newUser);
    });
}

function deleteUser(id, callBack) {
    UserModel.find({_id: id}).remove(callBack);
}