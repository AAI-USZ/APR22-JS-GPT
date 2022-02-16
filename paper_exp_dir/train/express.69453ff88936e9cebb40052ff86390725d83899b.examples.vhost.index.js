

var express = require('../..');





var main = express();

main.use(express.logger('dev'));

main.get('/', function(req, res){
res.send('Hello from main app!')
});

