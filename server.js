let express = require('express');
let bodyParser = require('body-parser');
let startup = require('./modules/startup.js');
require('./modules/dbConfig.js').connect();
let cors = require('cors');

let app = express();
app.set('port', startup.port(process.argv));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const userDb = require('./modules/models/user/UserDb.js');

app.get('/users', function(req, res) {
    userDb.getUser(req, function (err, data) {
        if (err) console.log(err);
        else {
            res.status(200);
            res.send(data);
        }
    });
});

app.options('/users/user', cors()); // enable pre-flight request for POST request
app.post('/users/user', cors(), function (req, res) {
    userDb.addUser(req, function (err, results) {
        if (err) res.status(500).send();
        else {
            let status = results.status ? results.status : 200;
            res.status(status);
            res.send(results.message);
        }
    });
});

app.options('/users/:id', cors()); // enable pre-flight request for DELETE request
app.delete('/users/:id', function (req, res) {
    userDb.deleteUser(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200);
            res.send(data);
        }
    })
});

app.use(function(req, res) {
	res.status(404).send();
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send();
});

app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});
