


var express = require('./../../lib/express');

var app = express.createServer();

app.get('/', function(req, res){

throw new Error('something broke!');
});

app.get('/next', function(req, res, next){

next(new Error('oh no!'))
});




app.use('/', express.errorHandler({ dumpExceptions: true, showStack: true }));

app.listen(3000);
