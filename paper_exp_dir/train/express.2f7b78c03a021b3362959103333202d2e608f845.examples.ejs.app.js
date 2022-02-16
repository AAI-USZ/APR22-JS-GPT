

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer();



app.register('.html', require('ejs'));



app.set('views', __dirname + '/views');
app.set('view engine', 'html');


var users = [
{ name: 'tj', email: 'tj@sencha.com' }
, { name: 'ciaran', email: 'ciaranj@gmail.com' }
, { name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
