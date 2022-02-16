


var fs = require('fs'),
express = require('../../lib/express');

exports.boot = function(app){
bootApplication(app);
bootControllers(app);
};



function bootApplication(app) {
app.use(express.logger({ format: ':method :url :status' }));
app.use(express.bodyDecoder());
app.use(express.methodOverride());
app.use(express.cookieDecoder());
app.use(express.session());
app.use(app.router);
app.use(express.staticProvider(__dirname + '/public'));


app.use(function(req, res){
res.render('404');
});


app.set('views', __dirname + '/views');
app.register('.html', require('ejs'));
app.set('view engine', 'html');


