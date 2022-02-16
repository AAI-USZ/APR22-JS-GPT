




var connect = require('connect')
, Server = require('./server');



var exports = module.exports = connect.middleware;



exports.version = '2.0.0-pre';



exports.createServer = function(){
return new Server(Array.prototype.slice.call(arguments));
};
