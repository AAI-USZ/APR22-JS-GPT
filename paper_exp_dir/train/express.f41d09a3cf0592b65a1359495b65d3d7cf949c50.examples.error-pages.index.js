

var express = require('../../')
, app = module.exports = express()
, silent = 'test' == process.env.NODE_ENV;


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');




app.enable('verbose errors');



if ('production' == app.settings.env) {
app.disable('verbose errors');
}

app.use(express.favicon());

silent || app.use(express.logger('dev'));



app.get('/', function(req, res){
res.render('index.jade');
});

app.get('/404', function(req, res, next){



next();
});

app.get('/403', function(req, res, next){

var err = new Error('not allowed!');
err.status = 403;
