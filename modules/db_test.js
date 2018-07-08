let dbConfig = require("./dbConfig.js");

module.exports = {
    testConnection: testConnection
};

function testConnection(req, res, errorHandler) {
    let context = {};
    let params = {};
    dbConfig.pool.query("SELECT email FROM user", params, function (err, rows, fields) {
        if (err) {
            errorHandler(err);
            return;
        }
        context.cities = rows;
        res.send(context);
    })
}
