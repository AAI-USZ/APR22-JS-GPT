


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
