let express = require('express');
let bodyParser = require('body-parser');
let startup = require('./modules/startup.js');

let cors = require('cors');
const tokenManager = require('./modules/auth/tokenManager');
const userDb = require('./modules/models/user/UserDb.js');

let app = express();

app.set('port', startup.port(process.argv));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Enable cors preflights for all requests
app.options('*', cors());

// Token Auth middleware
// If not hitting login URL, verify token using JWT
app.use(function (req, res, next) {
    if (req.originalUrl === '/auth/login') {
        next();
        return;
    }
    tokenManager.verifyToken(req.headers, (err, authData) => {
        if (err || authData.length === 0) {
            res.sendStatus(403);
        } else {
            req.authData = authData;
            next();
        }
    });
});

// Load auth Routes
const auth = require('./modules/auth/routes');
app.use('/auth', auth);

app.get('/users', function(req, res) {
    userDb.getUser(req.query, function (err, data) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.status(status);
            res.json(data);
        } else {
            res.status(200);
            let users = [];
            data.forEach(user => {
                users.push({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    admin: user.admin,
                    company: user.company,
                    _id: user._id
                })
            });
            res.send(users);
        }
    });
});

app.post('/users/user', cors(), function (req, res) {
    userDb.addUser(req, function (err, data) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.status(status);
            res.json(data.message);
        } else {
            let status = data.status ? data.status : 200;
            res.status(status);
            res.send(data.message);
        }
    });
});

app.delete('/users/:id', function (req, res) {
    userDb.deleteUser(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.status(status);
            res.json(data);
        } else {
            let status = data.status ? data.status : 200;
            res.status(status);
            res.json(data);
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

require('./modules/dbConfig.js').connect();
app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});
