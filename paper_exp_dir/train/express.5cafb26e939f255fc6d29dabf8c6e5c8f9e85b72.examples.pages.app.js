


var express = require('./../../lib/express');

var app = express.createServer(),
sys = require('sys');





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




