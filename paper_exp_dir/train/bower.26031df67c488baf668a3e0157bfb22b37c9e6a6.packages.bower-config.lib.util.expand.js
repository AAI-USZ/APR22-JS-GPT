var object = require('mout/object');
var lang = require('mout/lang');
var string = require('mout/string');

function camelCase(config) {
var camelCased = {};


object.forOwn(config, function(value, key) {

if (value == null) {
return;
}

key = string.camelCase(key.replace(/_/g, '-'));
camelCased[key] = lang.isPlainObject(value) ? camelCase(value) : value;
});

return camelCased;
}




function doEnvReplaceStr(f) {

var untildify = require('untildify');
f = untildify(f);


var envExpr = /(\\*)\$\{([^}]+)\}/g;
return f.replace(envExpr, function(orig, esc, name) {
esc = esc.length && esc.length % 2;
if (esc) return orig;
if (undefined === process.env[name]) {
return '${' + name + '}';
}

return process.env[name];
});
}

function envReplace(config) {
var envReplaced = {};
if (lang.isArray(config)) {
