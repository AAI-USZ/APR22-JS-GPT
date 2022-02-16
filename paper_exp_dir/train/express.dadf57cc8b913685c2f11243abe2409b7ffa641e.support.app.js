


var express = require('../');

var app = express()
, blog = express()
, admin = express();


blog.use('/admin', admin);
app.use('/blog', blog);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.self = true;

app.get('/render', function(req, res){
res.render('hello');
});

admin.get('/', function(req, res){
res.send('Hello World\n');
});

blog.get('/', function(req, res){
res.send('Hello World\n');
