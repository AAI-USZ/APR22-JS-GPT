

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');



var pub = __dirname + '/public';




var app = express.createServer(
express.compiler({ src: pub, enable: ['sass'] })
, express.static(pub)
);



app.set('views', __dirname + '/views');




app.set('view engine', 'jade');


var users = [
{ name: 'tj', email: 'tj@vision-media.ca' }
, { name: 'ciaran', email: 'ciaranj@gmail.com' }
, { name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
];

app.get('/', function(req, res){
res.render('users', { users: users });
});

app.get('/users', function(req, res){

