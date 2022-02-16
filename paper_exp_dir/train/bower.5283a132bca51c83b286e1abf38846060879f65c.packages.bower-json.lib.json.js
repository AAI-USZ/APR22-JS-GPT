var fs = require('graceful-fs');
var path = require('path');
var deepExtend = require('deep-extend');
var isAsset = require('./util/isAsset');
var isComponent = require('./util/isComponent');
var createError = require('./util/createError');

var possibleJsons = ['bower.json', 'component.json', '.bower.json'];

function read(file, options, callback) {
if (typeof options === 'function') {
callback = options;
options = {};
}


fs.stat(file, function (err, stat) {
if (err) {
return callback(err);
}


if (stat.isDirectory()) {
return find(file, function (err, file) {
if (err) {
return callback(err);
}

read(file, options, callback);
});
}


fs.readFile(file, function (err, contents) {
var json;

if (err) {
return callback(err);
}

try {
json = JSON.parse(contents.toString());
} catch (err) {
err.file = path.resolve(file);
err.code = 'EMALFORMED';
return callback(err);
}


try {
json = parse(json, options);
} catch (err) {
err.file = path.resolve(file);
return callback(err);
}

callback(null, json, file);
});
});
}

function readSync(file, options) {
var stat;
var filename;
var contents;
var json;

if (!options) {
options = {};
}
try {
stat = fs.statSync(file);
} catch (err) {
return err;
}
if (stat.isDirectory()) {
filename = findSync(file);
return readSync(filename);
}

contents = fs.readFileSync(file);

try {
json = JSON.parse(contents.toString());
} catch (err) {
err.file = path.resolve(file);
err.code = 'EMALFORMED';
return err;
}

try {
json = parse(json, options);
} catch (err) {
err.file = path.resolve(file);
return err;
}

return json;
}

function parse(json, options) {
options = deepExtend({
normalize: false,
validate: true,
clone: false
}, options || {});


if (options.clone) {
json = deepExtend({}, json);
}


if (options.validate) {
validate(json);
}


if (options.normalize) {
normalize(json);
}

return json;
}




function getIssues(json) {

var errors = [];


var warnings = [];

if (!json.name) {
errors.push('No "name" property set');
} else {
if (!/^[a-zA-Z0-9_][a-zA-Z0-9\.\-_]*$/.test(json.name)) {
errors.push('Name must be lowercase string, with dots, dashes, or @');
}

if (json.name.length > 50) {
warnings.push('The "name" is too long, the limit is 50 characters');
}

if (/[A-Z]/.test(json.name)) {
warnings.push('The "name" must be lowercase');
}

if (/^[\.-]/.test(json.name)) {
warnings.push('The "name" cannot start with dot or dash');
}

if (/[\.-]$/.test(json.name)) {
