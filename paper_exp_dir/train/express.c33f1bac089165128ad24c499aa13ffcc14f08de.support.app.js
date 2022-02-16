


var express = require('../');

var app = express()
, blog = express();

app.use('/blog', blog);

blog.get('/', function(req, res){
res.send('Hello World\n');
});

app.get('/', function(req, res){
