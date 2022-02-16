


var MongooseError = require('../error.js');



function MissingSchemaError (name) {
var msg = 'Schema hasn\'t been registered for model "' + name + '".\n'
+ 'Use mongoose.model(name, schema)';
MongooseError.call(this, msg);
Error.captureStackTrace(this, arguments.callee);
this.name = 'MissingSchemaError';
};



MissingSchemaError.prototype.__proto__ = MongooseError.prototype;



module.exports = MissingSchemaError;
