

var express = require('../../');
var path = require('path');

var app = module.exports = express();












app.engine('.html', require('ejs').__express);



app.set('views', path.join(__dirname, 'views'));



app.use(express.static(path.join(__dirname + 'public')));




app.set('view engine', 'html');


var users = [
{ name: 'tobi', email: 'tobi@learnboost.com' },
{ name: 'loki', email: 'loki@learnboost.com' },
{ name: 'jane', email: 'jane@learnboost.com' }
