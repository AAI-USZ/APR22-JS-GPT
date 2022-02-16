

'use strict';



var setPrototyeOf = require('setprototypeof')



exports.init = function(app){
return function expressInit(req, res, next){
if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
req.res = res;
res.req = req;
req.next = next;
