





var express = require('../..');
var redis = require('redis');

var db = redis.createClient();



var app = express();

app.use(express.static(__dirname + '/public'));



db.sadd('ferret', 'tobi');
db.sadd('ferret', 'loki');
db.sadd('ferret', 'jane');
db.sadd('cat', 'manny');
db.sadd('cat', 'luna');



app.get('/search/:query?', function(req, res){
var query = req.params.query;
