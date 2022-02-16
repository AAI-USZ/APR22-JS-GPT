




var exports = module.exports = require('connect').middleware;



exports.version = '1.0.0rc3';



var Server = exports.Server = require('./server');



exports.createServer = function(){
return new Server(Array.prototype.slice.call(arguments));
};



require('./view');
require('./response');
require('./request');
