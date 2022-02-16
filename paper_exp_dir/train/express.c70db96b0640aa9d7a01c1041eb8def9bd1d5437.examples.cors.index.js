

var express = require('../..')
, app = express()
, api = express();



app.use(express.static(__dirname + '/public'));



api.use(express.logger('dev'));
api.use(express.bodyParser());



api.all('*', function(req, res, next){
