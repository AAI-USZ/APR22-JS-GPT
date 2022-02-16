


var express = require('./../../lib/express'),
connect = require('connect');



var pub = __dirname + '/public';




var app = module.exports = express.createServer(
connect.compiler({ src: pub, enable: ['sass'] }),
connect.staticProvider(pub)
);



app.set('views', __dirname + '/views');




app.set('reload views', 2000);





var users = [
{ name: 'tj', email: 'tj@sencha.com' },
{ name: 'ciaran', email: 'ciaranj@gmail.com' },
{ name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
];

app.get('/', function(req, res){
