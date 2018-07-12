let express = require('express');
let bodyParser = require('body-parser');
let startup = require('./modules/startup.js');
require('./modules/dbConfig.js').connect();

let app = express();
app.set('port', startup.port(process.argv));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    
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
