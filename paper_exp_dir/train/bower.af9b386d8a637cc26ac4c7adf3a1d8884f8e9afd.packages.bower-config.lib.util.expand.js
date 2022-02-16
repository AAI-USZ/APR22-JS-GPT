var object = require('mout/object');
var lang = require('mout/lang');
var string = require('mout/string');

function camelCase(config) {
var camelCased = {};


object.forOwn(config, function (value, key) {

if (value == null) {
return;
}

key = string.camelCase(key.replace(/_/g, '-'));
camelCased[key] = lang.isPlainObject(value) ? camelCase(value) : value;
});

return camelCased;
}

function expand(config) {
config = camelCase(config);



if (typeof config.registry === 'string') {
config.registry = {
default: config.registry,
search: [config.registry],
register: config.registry,
publish: config.registry
};
} else if (typeof config.registry === 'object') {
if (config.registry.search && !Array.isArray(config.registry.search)) {
config.registry.search = [config.registry.search];
}

if (config.registry.default) {
config.registry.search = config.registry.search || config.registry.default;
