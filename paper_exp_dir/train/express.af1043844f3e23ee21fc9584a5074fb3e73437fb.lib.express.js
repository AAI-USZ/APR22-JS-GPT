

var deprecate = require('depd')('express');
var mixin = require('merge-descriptors');
var merge = require('utils-merge');
var connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response');



exports = module.exports = createApplication;



exports.mime = connect.mime;



function createApplication() {
var app = connect();
merge(app, proto);
app.request = { __proto__: req, app: app };
app.response = { __proto__: res, app: app };
app.init();
return app;
}



mixin(exports, connect.middleware);
