

require.paths.unshift(__dirname + '/../../support');



var express = require('./../../lib/express');

var app = express.createServer(),
sys = require('sys');


app.use(express.favicon());



app.use(express.logger({ format: '":method :url" :status' }));





app.use(app.router);








app.use(function(req, res, next){
next(new NotFound(req.url));
});

app.set('views', __dirname + '/views');



function NotFound(path){
this.name = 'NotFound';
if (path) {
Error.call(this, 'Cannot find ' + path);
this.path = path;
} else {
Error.call(this, 'Not Found');
}
Error.captureStackTrace(this, arguments.callee);
}

sys.inherits(NotFound, Error);









app.error(function(err, req, res, next){
if (err instanceof NotFound) {
res.render('404.jade', {
status: 404,
locals: {
error: err
}
});
} else {
next(err);
}
});




app.error(function(err, req, res){
res.render('500.jade', {
status: 500,
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
console.log('Express app started on port 3000');
