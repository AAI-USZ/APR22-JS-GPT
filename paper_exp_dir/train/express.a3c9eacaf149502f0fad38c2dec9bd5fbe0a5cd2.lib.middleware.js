


var utils = require('./utils');



exports.init = function(app){
return function expressInit(req, res, next){
if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
req.res = res;
res.req = req;
req.next = next;

req.__proto__ = app.request;
res.__proto__ = app.response;

res.locals = res.locals || utils.locals(res);

