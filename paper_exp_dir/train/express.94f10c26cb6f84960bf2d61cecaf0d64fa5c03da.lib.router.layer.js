

var pathRegexp = require('path-to-regexp');
var debug = require('debug')('express:router:layer');



var hasOwnProperty = Object.prototype.hasOwnProperty;



module.exports = Layer;

function Layer(path, options, fn) {
if (!(this instanceof Layer)) {
return new Layer(path, options, fn);
}

