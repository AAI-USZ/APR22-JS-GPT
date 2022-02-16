

var merge = require('merge-descriptors');
var connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')
, utils = connect.utils;



exports = module.exports = createApplication;



exports.mime = connect.mime;



function createApplication() {
var app = connect();
utils.merge(app, proto);
app.request = { __proto__: req, app: app };
app.response = { __proto__: res, app: app };
app.init();
return app;
}



merge(exports, connect.middleware);



exports.application = proto;
exports.request = req;
exports.response = res;



exports.Route = Route;
exports.Router = Router;


