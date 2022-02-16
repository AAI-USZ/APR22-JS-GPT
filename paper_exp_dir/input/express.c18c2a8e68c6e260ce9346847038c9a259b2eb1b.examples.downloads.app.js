


var express = require('../../')
, app = module.exports = express();

app.get('/', function(req, res){
res.send('<ul>'
+ '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
+ '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
+ '</ul>');
});



app.get('/files/:file(*)', function(req, res, next){
var file = req.params.file
, path = __dirname + '/files/' + file;

res.download(path);
});





app.use(function(err, req, res, next){



if (404 == err.status) {
res.statusCode = 404;
res.send('Cant find that file, sorry!');
} else {
next(err);
}
});

