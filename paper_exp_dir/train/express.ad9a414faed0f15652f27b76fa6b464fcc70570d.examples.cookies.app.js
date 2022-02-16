


var express = require('../../')
, app = module.exports = express();







app.use(express.favicon());


if ('test' != process.env.NODE_ENV) app.use(express.logger(':method :url'));





app.use(express.cookieParser('my secret here'));


app.use(express.bodyParser());

app.get('/', function(req, res){
if (req.cookies.remember) {
res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
} else {
