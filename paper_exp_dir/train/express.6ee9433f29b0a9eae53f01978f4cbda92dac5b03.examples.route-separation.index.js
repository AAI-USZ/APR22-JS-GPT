

var express = require('../..');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var site = require('./site');
var post = require('./post');
var user = require('./user');



app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));



app.get('/', site.index);



app.all('/users', user.list);
app.all('/user/:id/:op?', user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);



app.get('/posts', post.list);


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
}
