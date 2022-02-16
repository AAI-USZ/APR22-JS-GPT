

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer();

app.get('/', function(req, res){

throw new Error('something broke!');
});
