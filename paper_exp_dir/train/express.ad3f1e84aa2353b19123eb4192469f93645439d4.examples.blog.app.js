


var express = require('../../')
, app = module.exports = express();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.configure('development',function(){
app.use(express.logger('dev'));
})

app.configure(function(){
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session());
app.use(require('./middleware/locals'));
