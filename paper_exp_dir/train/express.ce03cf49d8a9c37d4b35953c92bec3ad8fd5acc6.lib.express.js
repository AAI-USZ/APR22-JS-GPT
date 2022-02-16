




var connect = require('connect')
, proto = require('./proto')
, Route = require('./router/route')
, utils = connect.utils;



exports = module.exports = createApplication;



exports.version = '3.0.0alpha1';



function createApplication() {
var app = connect();
utils.merge(app, proto);
