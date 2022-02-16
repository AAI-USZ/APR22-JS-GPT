




exports.version = '0.14.0';



var Application = require('./application').Application;



exports.createApplication = function(middleware){
return new Application(middleware);
};
