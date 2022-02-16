




exports.version = '0.14.0';



var Server = require('./server');



exports.createServer = function(){
return new Server(Array.prototype.slice.call(arguments));
};



require('./view');
