




exports.version = '1.0.0rc';



var Server = exports.Server = require('./server');



exports.createServer = function(){
return new Server(Array.prototype.slice.call(arguments));
};



require('./view');
require('./request');
require('./response');
