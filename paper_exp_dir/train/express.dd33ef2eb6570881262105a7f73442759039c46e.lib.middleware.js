




var utils = require('./utils');



exports.init = function(app){
return function expressInit(req, res, next){
req.app = res.app = app;
res.setHeader('X-Powered-By', 'Express');
req.res = res;
res.req = req;
