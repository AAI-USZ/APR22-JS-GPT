var os = require('os');
var path = require('path');
var info = require('./info');
var lookup = require('./lookup');
var search = require('./search');
var register = require('./register');

var RegistryClient = function (options) {
options = options || {};



options.registry = options.registry || 'https://bower.herokuapp.com';
if (typeof options.registry !== 'object') {
options.registry = {
search: [options.registry],
register: options.registry,
publish: options.registry
};
} else if (!Array.isArray(options.registry.search)) {
options.registry.search = [options.registry.search];
}


options.registry.search = options.registry.search.map(function (url) {
return url.replace(/\/+$/, '');
});
options.registry.register = options.registry.register.replace(/\/+$/, '');
options.registry.publish = options.registry.publish.replace(/\/+$/, '');


if (typeof options.ca !== 'object') {
options.ca = {
search: [options.ca],
register: options.ca,
publish: options.ca
};
} else if (!Array.isArray(options.ca.search)) {
options.ca.search = [options.ca.search];
}


if (!options.cache) {
options.cache = path.join(os.tmpdir ? os.tmpdir() : os.tmpDir(), 'bower-registry');
}


if (typeof options.timeout !== 'number') {
options.timeout = 5000;
}


options.strictSsl = options.strictSsl == null ? true : !!options.strictSsl;


