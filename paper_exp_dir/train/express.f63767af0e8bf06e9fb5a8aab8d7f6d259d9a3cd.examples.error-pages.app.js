


var express = require('../../')
, app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));








app.use(app.router);









app.use(function(req, res, next){

if (req.accepts('html')) {
console.log('test');
res.status(404);
res.render('404', { url: req.url });
return;
}


if (req.accepts('json')) {
res.send({ error: 'Not found' });
return;
}
