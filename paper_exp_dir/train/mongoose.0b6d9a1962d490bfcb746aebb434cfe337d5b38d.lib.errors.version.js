


var MongooseError = require('../error.js');



function VersionError () {
MongooseError.call(this, 'No matching document found.');
Error.captureStackTrace(this, arguments.callee);
this.name = 'VersionError';
};



VersionError.prototype.__proto__ = MongooseError.prototype;



module.exports = VersionError;
