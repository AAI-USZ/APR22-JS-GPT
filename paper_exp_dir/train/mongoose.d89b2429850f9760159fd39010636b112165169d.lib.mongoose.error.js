


function MongooseError (msg) {
Error.call(this);
Error.captureStackTrace(this, arguments.callee);
this.message = msg;
this.name = 'MongooseError';
};



MongooseError.prototype.__proto__ = Error.prototype;



module.exports = MongooseError;
