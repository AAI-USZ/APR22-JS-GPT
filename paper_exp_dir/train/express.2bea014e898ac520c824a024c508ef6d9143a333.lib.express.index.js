




exports.version = '0.14.0';



var Server = require('./server');



exports.createServer = function(middleware){
return new Server(middleware);
};
