

'use strict';



var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');
var Route = require('./router/route');
var Router = require('./router');
var req = require('./request');
var res = require('./response');



exports = module.exports = createApplication;



function createApplication() {
var app = function(req, res, next) {
app.handle(req, res, next);
};

mixin(app, EventEmitter.prototype, false);
mixin(app, proto, false);


app.request = Object.create(req, {
app: { configurable: true, enumerable: true, writable: true, value: app }
})


app.response = Object.create(res, {
app: { configurable: true, enumerable: true, writable: true, value: app }
})

app.init();
