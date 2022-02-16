


var SchemaType = require('../schematype');



function Mixed (path, options) {

if (options &&
options.default &&
Array.isArray(options.default) &&
0 === options.default.length) {
options.default = Array;
}

SchemaType.call(this, path, options);
};


Mixed.prototype.__proto__ = SchemaType.prototype;



Mixed.prototype.checkRequired = function (val) {
return true;
};



Mixed.prototype.cast = function (val) {
return val;
};

Mixed.prototype.castForQuery = function ($cond, val) {
if (arguments.length === 2) return val;
return $cond;
};



module.exports = Mixed;
