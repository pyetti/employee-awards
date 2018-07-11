module.exports = {
    testConnection: testConnection
};

let UserModel = require('./models/User.js');
function testConnection(req, res) {
    UserModel.find({}, function (err, data) {
        if (err) {
            console.log(err);
            res.stats(500).send();
        } else {
            console.log(data);
            res.send(data);
        }
    });
}
