


var express = require('../../')
, app = module.exports = express()
, silent = 'test' == process.env.NODE_ENV;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());

silent || app.use(express.logger('dev'));








app.use(app.router);









app.use(function(req, res, next){

if (req.accepts('html')) {
res.status(404);
res.render('404', { url: req.url });
return;
}


if (req.accepts('json')) {
res.send({ error: 'Not found' });
return;
}
