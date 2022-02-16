

var express = require('../../')
, app = module.exports = express()
, silent = 'test' == process.env.NODE_ENV;


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');




app.enable('verbose errors');



if ('production' == app.settings.env) app.disable('verbose errors');

app.use(express.favicon());

silent || app.use(express.logger('dev'));








app.use(app.router);









app.use(function(req, res, next){
res.status(404);

