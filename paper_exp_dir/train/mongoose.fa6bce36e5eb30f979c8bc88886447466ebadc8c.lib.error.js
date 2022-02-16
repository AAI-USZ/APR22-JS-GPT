


function MongooseError(msg) {
Error.call(this);
if (Error.captureStackTrace) {
Error.captureStackTrace(this);
} else {
this.stack = new Error().stack;
}
this.message = msg;
this.name = 'MongooseError';
}



MongooseError.prototype = Object.create(Error.prototype);
MongooseError.prototype.constructor = Error;



module.exports = exports = MongooseError;



MongooseError.messages = require('./messages');


MongooseError.Messages = MongooseError.messages;



MongooseError.DocumentNotFoundError = require('./notFound');



MongooseError.CastError = require('./cast');
MongooseError.ValidationError = require('./validation');
MongooseError.ValidatorError = require('./validator');
MongooseError.VersionError = require('./version');
MongooseError.OverwriteModelError = require('./overwriteModel');
MongooseError.MissingSchemaError = require('./missingSchema');
MongooseError.DivergentArrayError = require('./divergentArray');
