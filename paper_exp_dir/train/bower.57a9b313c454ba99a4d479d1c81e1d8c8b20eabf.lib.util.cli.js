var mout = require('mout');
var nopt = require('nopt');
var renderers = require('../renderers');

function readOptions(options, argv) {
var types;
var noptOptions;
var parsedOptions = {};
var shorthands = {};

if (Array.isArray(options)) {
argv = options;
options = {};
} else {
options = options || {};
}

types = mout.object.map(options, function (option) {
return option.type;
});
