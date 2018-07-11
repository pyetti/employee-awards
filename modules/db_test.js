module.exports = {
    testConnection: testConnection
};

let UserModel = require('./models/User.js');
function testConnection(callBack) {
    UserModel.find({}, function (err, data) {
        callBack(err, data);
    });
}
