




var connect = require('connect')
, HTTPSServer = require('./https')
, HTTPServer = require('./http');



var exports = module.exports = connect.middleware;



exports.version = '2.0.0beta';



exports.createServer = function(options){
if ('object' == typeof options) {
return new HTTPSServer(options, Array.prototype.slice.call(arguments, 1));
} else {
return new HTTPServer(Array.prototype.slice.call(arguments));
}
};



exports.HTTPServer = HTTPServer;



require('./view');



require('./response');



require('./request');
