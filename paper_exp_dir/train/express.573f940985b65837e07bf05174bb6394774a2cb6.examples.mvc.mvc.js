


var fs = require('fs')
, express = require('../../lib/express');

exports.boot = function(app){
bootApplication(app);
bootControllers(app);
};



function bootApplication(app) {
app.use(express.logger(':method :url :status'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));


app.error(function(err, req, res){
console.dir(err)
res.render('500');
});


app.use(function(req, res){
res.render('404');
});


app.set('views', __dirname + '/views');
app.register('.html', require('ejs'));
app.set('view engine', 'html');


app.dynamicHelpers({
request: function(req){
return req;
},

hasMessages: function(req){
if (!req.session) return false;
return Object.keys(req.session.flash || {}).length;
},

messages: function(req){
return function(){
var msgs = req.flash();
return Object.keys(msgs).reduce(function(arr, type){
return arr.concat(msgs[type]);
}, []);
