let express = require('express');
let bodyParser = require('body-parser');
let startup = require('./modules/startup.js');

let cors = require('cors');
const tokenManager = require('./modules/auth/tokenManager');

let app = express();

app.set('port', 8888);

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
    if (req.originalUrl === '/auth/login' || req.originalUrl === '/users/password') {
        next();
        return;
    }
    tokenManager.verifyToken(req.headers, (err, authData) => {
        if (err || authData.length === 0) {
            console.log(err);
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

// Load user Routes
const userRoutes = require('./modules/models/user/UserRoutes');
app.use('/users', userRoutes);

app.use(function(req, res) {
	res.status(404).send();
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send();
});

require('./modules/dbConfig.js').connect();
app.listen(app.get('port'), function() {
    startup.env(process.argv)
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});
