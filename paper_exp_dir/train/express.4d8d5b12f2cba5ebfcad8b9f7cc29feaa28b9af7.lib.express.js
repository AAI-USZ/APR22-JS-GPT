




var connect = require('connect')
, HTTPSServer = require('./https')
, HTTPServer = require('./http')
, Route = require('./router/route');



exports = module.exports = connect.middleware;



exports.version = '3.0.0alpha1';



exports.createServer = function(options){
if ('object' == typeof options) {
return new HTTPSServer(options, Array.prototype.slice.call(arguments, 1));
} else {
return new HTTPServer(Array.prototype.slice.call(arguments));
}
};



exports.HTTPServer = HTTPServer;
exports.HTTPSServer = HTTPSServer;
exports.Route = Route;



exports.methods = require('./router/methods');



exports.View =
exports.view = require('./view');



require('./response');



require('./request');



exports.errorHandler.title = 'Express';

