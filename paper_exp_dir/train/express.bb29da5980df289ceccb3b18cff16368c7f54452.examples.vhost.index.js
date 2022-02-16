


var express = require('../..');





var main = express();

main.use(express.logger('dev'));

main.get('/', function(req, res){
res.send('Hello from main app!')
});

main.get('/:sub', function(req, res){
res.send('requsted ' + req.params.sub);
});



var redirect = express();

redirect.all('*', function(req, res){
console.log(req.subdomains);
res.redirect('http://example.com:3000/' + req.subdomains[0]);
});
