

var express = require('../../')
, app = module.exports = express()
, silent = 'test' == process.env.NODE_ENV;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());

silent || app.use(express.logger('dev'));
