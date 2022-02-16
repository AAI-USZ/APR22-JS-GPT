


var express = require('../');

var app = express()
, blog = express()
, admin = express();


blog.use('/admin', admin);
app.use('/blog', blog);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.self = true;

var repo = require('../package.json');

app.get('/render', function(req, res){
res.render('hello');
