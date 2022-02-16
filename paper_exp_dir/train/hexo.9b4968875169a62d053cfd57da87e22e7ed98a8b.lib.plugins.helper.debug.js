'use strict';

const { inspect } = require('util');


function inspectObject(object, options) {
return inspect(object, options);
}


function log(...args) {
return Reflect.apply(console.log, null, args);
}

exports.inspectObject = inspectObject;
exports.log = log;
