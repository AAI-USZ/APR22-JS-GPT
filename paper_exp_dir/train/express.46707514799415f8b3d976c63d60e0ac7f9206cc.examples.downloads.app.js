


var express = require('../../lib/express');

var app = express.createServer();

app.get('/', function(req, res){
res.send('<ul>'
+ '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
+ '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
+ '</ul>');
});



app.get('/files/:file(*)', function(req, res, next){
var file = req.params.file
, path = __dirname + '/files/' + file;



res.download(path, function(err){



if (err) return next(err);




console.log('transferred %s', path);
}, function(err){


});
});

app.use(function(err, req, res, next){
if ('ENOENT' == err.code) {
res.send('Cant find that file, sorry!');
} else {

next(err);
}
});

app.listen(3000);
console.log('Express started on port 3000');
