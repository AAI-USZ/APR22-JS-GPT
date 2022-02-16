

var MongooseError = require('../error.js');



function CastError (type, value, path) {
MongooseError.call(this, 'Cast to ' + type + ' failed for value "' + value + '" at path "' + path + '"');
Error.captureStackTrace(this, arguments.callee);
this.name = 'CastError';
this.type = type;
this.value = value;
this.path = path;
};



CastError.prototype.__proto__ = MongooseError.prototype;



module.exports = CastError;
