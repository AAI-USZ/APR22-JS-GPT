


var express = require('../../lib/express');



var app = express.createServer(
express.cookieDecoder(),
express.session()
);



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');








app.dynamicHelpers({
messages: function(req, res){

var messages = req.flash();

