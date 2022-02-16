


var fs = require('fs')
, express = require('../../lib/express');

exports.boot = function(app){
bootApplication(app);
bootControllers(app);
};



function bootApplication(app) {
app.use(express.logger({ format: ':method :url :status' }));
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(app.router);
