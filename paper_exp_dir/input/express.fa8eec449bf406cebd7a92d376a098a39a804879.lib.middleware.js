


var utils = require('./utils');



exports.init = function(app){
return function expressInit(req, res, next){
req.app = res.app = app;
req.res = res;
res.req = req;
req.next = next;

req.__proto__ = app.request;
res.__proto__ = app.response;

res.locals = res.locals || utils.locals(res);

next();
}
};
