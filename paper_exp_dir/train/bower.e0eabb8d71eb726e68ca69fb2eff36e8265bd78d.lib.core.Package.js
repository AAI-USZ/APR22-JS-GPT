var util = require('util');
var fs = require('fs');
var path = require('path');
var events = require('events');
var mout = require('mout');
var Q = require('q');
var tmp = require('tmp');
var UnitOfWork = require('./UnitOfWork');
var config = require('./config');
var createPackage;
var createError = require('../util/createError');

var Package = function (endpoint, options) {
options = options || {};

this._endpoint = endpoint;
this._name = options.name;
this._explicitName = !!this.name;
this._range = options.range || '*';
this._unitOfWork = options.unitOfWork || new UnitOfWork();
};

util.inherits(Package, events.EventEmitter);



Package.prototype.getName = function () {
return this._name;
};

Package.prototype.getEndpoint = function () {
return this._endpoint;
};

Package.prototype.getRange = function () {
return this._range;
};

Package.prototype.getTempDir = function () {
return this._tempDir;
};

Package.prototype.resolve = function () {

if (this._resolved) {
throw createError('Package is already resolved', 'EALREADYRES');
}


return this._unitOfWork.enqueue(this)
.then(function (done) {

return this._createTempDir()

.then(this._resolveSelf.bind(this))

.then(this._readRc.bind(this))

.then(this._readJson.bind(this))

.then(this._parseJson.bind(this))


.then(function (dependencies) {
this._resolved = true;
done();
return dependencies;
}.bind(this), function (err) {
this._resolveError = err;
done();
throw err;
}.bind(this))

.then(this._resolveDependencies.bind(this));
}.bind(this), function (err) {


if (err.code === 'EDUPL') {
mout.object.mixIn(this, err.pkg);
} else {
this._resolveError = err;
throw err;
}
});
};

Package.prototype.getResolveError = function () {
return this._resolveError;
};

Package.prototype.getJson = function () {
this._assertResolved();
return this._json;
};

Package.prototype.getDependencies = function () {
this._assertResolved();
return this._dependencies;
};

Package.prototype.install = function () {
this._assertResolved();


};



Package.prototype._resolveSelf = function () {};




Package.prototype._createTempDir = function () {
console.log('_createTempDir');


if (this._tempDir) {
return Q.fcall(this._tempDir);
}

return Q.nfcall(tmp.dir, {
prefix: 'bower-' + this.name + '-',
mode: parseInt('0777', 8) & (~process.umask())
})
.then(function (dir) {
this._tempDir = dir;
return dir;
}.bind(this));
};

Package.prototype._readRc = function () {
console.log('_readRc');


if (this._rc) {
return Q.fcall(this._rc);
}

var rcFile = path.join(this.getTempDir(), '.bowerrc');


return Q.nfcall(fs.readFile, rcFile)


.then(function (contents) {
try {
this._rc = JSON.parse(contents);
return this._rc;
} catch (e) {
throw createError('Unable to parse local ".bowerrc" file', 'EINVJSON', {
details: 'Unable to parse JSON file "' + rcFile + '": ' + e.message
});
}
}.bind(this), function (err) {

if (err.code === 'ENOENT') {
return config;
}

throw err;
});
};

Package.prototype._readJson = function (rc) {
console.log('_readJson');


if (this._json) {
return Q.fcall(this._json);
}

var jsonFile;

function read(file) {
jsonFile = file;
return Q.nfcall(fs.readFile, path.join(this.getTempDir(), file));
}


return read.call(this, rc.json)

.then(null, read.bind(this, 'bower.json'))

.then(null, function () {
return read.call(this, 'component.json')
.then(function (contents) {
this.emit('warn', 'Package "' + this.name + '" is using the deprecated component.json file');
return contents;
}.bind(this));
}.bind(this))

.then(function (contents) {

try {
this._json = JSON.parse(contents);
return this._json;
} catch (e) {
throw createError('Unable to parse local "' + path.basename(jsonFile) + '" file', 'EINVJSON', {
details: 'Unable to parse JSON file "' + jsonFile + '": ' + e.message
});
}

}.bind(this), function (err) {

if (err.code === 'ENOENT') {
this._json = { name: this.name };
return {};
}


throw err;
}.bind(this));
};

Package.prototype._parseJson = function (json) {
console.log('_parseJson');


if (this._dependencies) {
return Q.fcall(this._dependencies);
}



if (!this._explicitName && json.name !== this.name) {
this.name = json.name;
this.emit('name_change', this.name);
}


return Q.fcall(function () {


}.bind(this))

.then(function () {
var key,
promises = [];


createPackage = createPackage || require('./createPackage');
if (json.dependencies) {
for (key in json.dependencies) {
promises.push(createPackage(json.dependencies[key], { name: key, unitOfWork: this._unitOfWork }));
}
}


return Q.all(promises).then(function (packages) {
this._dependencies = packages;
return packages;
}.bind(this));
});
};


Package.prototype._resolveDependencies = function (dependencies) {
console.log('_resolveDependencies');

var promises = dependencies.map(function (dep) {
return dep.resolve();
});

return Q.all(promises);
};

Package.prototype._assertResolved = function () {
if (!this._resolved) {
throw createError('Package is not yet resolved', 'ENOTRES');
}
};

module.exports = Package;
