

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');



var app = express.createServer(
express.cookieDecoder()
, express.session({ secret: 'keyboard cat' })
);



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');








app.dynamicHelpers({





messages: function(req, res){





return function(){

var messages = req.flash();

return res.partial('messages', {

