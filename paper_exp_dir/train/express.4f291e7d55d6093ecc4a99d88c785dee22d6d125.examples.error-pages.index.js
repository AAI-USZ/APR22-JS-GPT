

var express = require('../../');
var app = module.exports = express();
var logger = require('morgan');
var silent = 'test' == process.env.NODE_ENV;


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');




app.enable('verbose errors');



if ('production' == app.settings.env) app.disable('verbose errors');

silent || app.use(logger('dev'));



app.get('/', function(req, res){
res.render('index.ejs');
});

app.get('/404', function(req, res, next){



next();
});

app.get('/403', function(req, res, next){

var err = new Error('not allowed!');
err.status = 403;
next(err);
});

app.get('/500', function(req, res, next){

next(new Error('keyboard cat!'));
});











app.use(function(req, res, next){
res.status(404);

res.format({
html: function () {
res.render('404', { url: req.url })
},
json: function () {
res.json({ error: 'Not found' })
},
default: function () {
res.type('txt').send('Not found')
}
