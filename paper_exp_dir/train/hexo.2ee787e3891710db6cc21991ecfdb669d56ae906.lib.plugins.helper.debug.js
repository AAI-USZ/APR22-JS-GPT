'use strict';

const util = require('util');


function inspectObject(object, options) {
return util.inspect(object, options);
}


function log(...args) {
return console.log.apply(null, args);
}

exports.inspectObject = inspectObject;
exports.log = log;
