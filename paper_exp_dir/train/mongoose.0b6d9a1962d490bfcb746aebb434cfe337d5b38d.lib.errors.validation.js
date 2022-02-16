


var MongooseError = require('../error.js')



function ValidationError (instance) {
MongooseError.call(this, "Validation failed");
Error.captureStackTrace(this, arguments.callee);
this.name = 'ValidationError';
this.errors = instance.errors = {};
};



ValidationError.prototype.toString = function () {
var ret = this.name + ': ';
var msgs = [];

Object.keys(this.errors).forEach(function (key) {
if (this == this.errors[key]) return;
msgs.push(String(this.errors[key]));
}, this)

return ret + msgs.join(', ');
};



ValidationError.prototype.__proto__ = MongooseError.prototype;



module.exports = exports = ValidationError;
