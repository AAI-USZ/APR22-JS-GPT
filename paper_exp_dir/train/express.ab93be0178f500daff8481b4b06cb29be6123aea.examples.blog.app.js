

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express')
, messages = require('express-contrib/messages');

var app = module.exports = express.createServer();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.mounted(function(other){
console.log('ive been mounted!');
});




app.dynamicHelpers({ messages: messages });



