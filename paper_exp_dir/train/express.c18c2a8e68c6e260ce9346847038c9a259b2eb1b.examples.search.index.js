






var express = require('../..')
, redis = require('redis')
, db = redis.createClient();



var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname);



db.sadd('ferret', 'tobi');
db.sadd('ferret', 'loki');
db.sadd('ferret', 'jane');
db.sadd('cat', 'manny');
db.sadd('cat', 'luna');



app.get('/', function(req, res){
res.render('search');
});



app.get('/search/:query?', function(req, res){
var query = req.params.query;
db.smembers(query, function(err, vals){
if (err) return res.send(500);
res.send(vals);
});
});



app.get('/client.js', function(req, res){
res.sendfile(__dirname + '/client.js');
});


if (!module.parent) {
