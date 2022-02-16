

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express')
, stylus = require('stylus');

var app = express.createServer();








function compile(str, path, fn) {
stylus(str)
.set('filename', path)
.set('compress', true)
.render(fn);
};





app.use(stylus.middleware({
src: __dirname + '/views'
, dest: __dirname + '/public'
, compile: compile
}));









app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
res.render('index.jade');
});

app.listen(3000);
console.log('server listening on port 3000');
