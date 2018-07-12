let express = require('express');
let bodyParser = require('body-parser');
let startup = require('./modules/startup.js');
require('./modules/dbConfig.js').connect();

let app = express();
app.set('port', startup.port(process.argv));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userDb = require('./modules/models/user/UserDb.js');

app.get('/user', function(req, res) {
    console.log(url);
    userDb.getUser(req, function (err, data) {
        if (err) console.log(err);
        else {
            res.status(200);
            res.send(data);
        }
    });
});

app.post('/user', function (req, res) {
    userDb.addUser(req, function (err, newUser) {
        if (err) res.status(500).send();
        else {
            res.status(200);
            res.send(newUser);
        }
    });
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
