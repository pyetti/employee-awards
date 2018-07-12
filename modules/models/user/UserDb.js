let UserModel = require('./User.js');
const queryString = require('query-string');

module.exports = {
    getUser: get,
    addUser: add
};

function get(request, callBack) {
    UserModel.find(request.query, function (err, data) {
        callBack(err, data);
    });
}

function add(request, callBack) {
    let newUser = new UserModel(request.body);
    newUser.save(function (err) {
        callBack(err, newUser);
    });
}
