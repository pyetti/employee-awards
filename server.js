let express = require('express');
let handlebars = require('express-handlebars').create({defaultLayout: 'main'});
let bodyParser = require('body-parser');
let startup = require('./modules/startup.js');
let dbtest = require('./modules/db_test.js');

require('./modules/dbConfig.js').connect();

let app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', startup.port(process.argv));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/users', function(req, res) {
    dbtest.testConnection(function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(data);
            res.status(200);
            res.send(data);
        }
    });
});

app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});
