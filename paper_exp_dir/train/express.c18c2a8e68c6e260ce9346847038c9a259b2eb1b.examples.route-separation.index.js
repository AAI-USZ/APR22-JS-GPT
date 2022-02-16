


var express = require('../..')
, app = express()
, site = require('./site')
, post = require('./post')
, user = require('./user');



app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
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
