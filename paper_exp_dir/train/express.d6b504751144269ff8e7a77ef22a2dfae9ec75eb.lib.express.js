




var connect = require('connect')
, proto = require('./proto')
, Route = require('./router/route')
, utils = connect.utils;

exports = module.exports = createServer;

function createServer() {
var app = connect();
utils.merge(app, proto);
return app;
}




