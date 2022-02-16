

var express = require('../..');
var logger = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var api = express();



app.use(express.static(__dirname + '/public'));



api.use(logger('dev'));
api.use(bodyParser.json());



api.all('*', function(req, res, next){
if (!req.get('Origin')) return next();

res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
res.set('Access-Control-Allow-Methods', 'PUT');
res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

if ('OPTIONS' == req.method) return res.send(200);
next();
});



api.put('/user/:id', function(req, res){
console.log(req.body);
res.send(204);
});

app.listen(3000);
api.listen(3001);

console.log('app listening on 3000');
console.log('api listening on 3001');
