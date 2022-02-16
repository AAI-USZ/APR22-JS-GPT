

'use strict';



var setPrototypeOf = require('setprototypeof')



exports.init = function(app){
return function expressInit(req, res, next){
if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
req.res = res;
res.req = req;
req.next = next;

setPrototypeOf(req, app.request)
setPrototypeOf(res, app.response)

res.locals = res.locals || Object.create(null);

next();
};
};

