


var MongooseError = require('../error.js');



function OverwriteModelError (name) {
MongooseError.call(this, 'Cannot overwrite `' + name + '` model once compiled.');
Error.captureStackTrace(this, arguments.callee);
this.name = 'OverwriteModelError';
};



OverwriteModelError.prototype.__proto__ = MongooseError.prototype;



module.exports = OverwriteModelError;
