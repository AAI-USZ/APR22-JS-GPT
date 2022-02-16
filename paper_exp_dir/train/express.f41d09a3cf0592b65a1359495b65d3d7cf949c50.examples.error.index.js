


var express = require('../../')
, app = module.exports = express()
, test = app.get('env') == 'test';

if (!test) app.use(express.logger('dev'));







function error(err, req, res, next) {

if (!test) console.error(err.stack);


res.send(500);
}

app.get('/', function(req, res){

throw new Error('something broke!');
