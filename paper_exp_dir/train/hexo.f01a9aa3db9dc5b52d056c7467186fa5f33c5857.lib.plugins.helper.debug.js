'use strict';

var util = require('util');


function inspectObject(object, options) {
return util.inspect(object, options);
}


function log() {
return console.log.apply(null, arguments);
}

exports.inspectObject = inspectObject;
exports.log = log;
