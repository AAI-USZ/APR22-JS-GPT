

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








app.use(app.router);









app.use(function(req, res, next){
res.status(404);


if (req.accepts('html')) {
res.render('404', { url: req.url });
return;
}


if (req.accepts('json')) {
res.send({ error: 'Not found' });
return;
}


res.type('txt').send('Not found');
});













app.use(function(err, req, res, next){



res.status(err.status || 500);
res.render('500', { error: err });
});



app.get('/', function(req, res){
res.render('index.jade');
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


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
