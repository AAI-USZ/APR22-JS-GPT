




var connect = require('connect')
, HTTPSServer = require('./https')
, HTTPServer = require('./http');



var exports = module.exports = connect.middleware;



exports.version = '2.3.0';



exports.createServer = function(options){
if ('object' == typeof options) {
return new HTTPSServer(options, Array.prototype.slice.call(arguments, 1));
} else {
return new HTTPServer(Array.prototype.slice.call(arguments));
}
};



exports.HTTPServer = HTTPServer;
exports.HTTPSServer = HTTPSServer;



require('./view');



require('./response');



require('./request');



exports.errorHandler.title = 'Express';

