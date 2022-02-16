




exports.init = function(app){
return function expressInit(req, res, next){
req.app = res.app = app;
if (req.next) return next();

res.setHeader('X-Powered-By', 'Express');
req.res = res;
res.req = req;
req.next = next;

req.__proto__ = app.request;
res.__proto__ = app.response;
