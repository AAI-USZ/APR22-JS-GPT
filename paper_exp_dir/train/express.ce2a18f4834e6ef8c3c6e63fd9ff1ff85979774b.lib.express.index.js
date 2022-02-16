




var exports = module.exports = require('connect').middleware;



exports.version = '2.0.0-pre';



var Server = exports.Server = require('./server');



exports.createServer = function(){
return new Server(Array.prototype.slice.call(arguments));
};



require('./view');



require('./response');



require('./request');
