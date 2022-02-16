


var express = require('./../../lib/express');

var app = express.createServer(),
sys = require('sys');

app.set('views', __dirname + '/views');



function NotFound(msg){
this.name = 'NotFound';
Error.call(this, msg);
Error.captureStackTrace(this, arguments.callee);
}

sys.inherits(NotFound, Error);









app.error(function(err, req, res, next){
if (err instanceof NotFound) {
res.render('404.jade');
} else {
next(err);
}
});




app.error(function(err, req, res){
res.render('500.jade', {
locals: {
error: err
}
});
});



app.get('/', function(req, res){
res.render('index.jade');
});

app.get('/404', function(req, res){
throw new NotFound;
});

app.get('/500', function(req, res, next){
next(new Error('keyboard cat!'));
});

app.listen(3000);
