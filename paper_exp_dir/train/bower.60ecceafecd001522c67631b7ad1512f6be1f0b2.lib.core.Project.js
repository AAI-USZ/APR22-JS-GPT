var glob = require('glob');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var bowerJson = require('bower-json');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

var Project = function (options) {
options = options || {};

this._options = options;
this._config = options.config || defaultConfig;
this._manager = new Manager(options);
};

Project.prototype.install = function (targets) {
var that = this;
var repairDissected;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}



if (!targets) {
return this._repair(true)
.fin(function () {
that._working = false;
}.bind(this));
}


return this._repair()

.then(function (dissected) {
repairDissected = dissected;
return that._analyse();
})


.spread(function (json, tree, flattened) {
var unresolved = {};
var resolved = {};


targets.forEach(function (target) {
unresolved[target.name] = endpointParser.decompose(target);
});






resolved = mout.object.filter(flattened, function (decEndpoint, name) {
return !unresolved[name];
});



return that._manager
.configure(unresolved, resolved)
.resolve()

.then(function () {
return that._manager.install();
})

.then(function (dissected) {
return mout.object.fillIn(dissected, repairDissected);
});
})
.fin(function () {
that._working = false;
}.bind(this));
};

Project.prototype.update = function (names) {

};

Project.prototype.uninstall = function (names, options) {

};

Project.prototype.getTree = function () {

};

Project.prototype.getFlatTree = function () {

};



Project.prototype._analyse = function () {

return Q.all([
this._readJson(),
this._readInstalled()
])
.spread(function (json, installed) {
var root;

root = {
name: json.name,
source: this._config.cwd,
target: json.version || '*',
json: json,
dir: this._config.cwd
};



this._restoreNode(root, installed);

if (!this._options.production) {
this._restoreNode(root, installed, 'devDependencies');
}
return [json, root, installed];
}.bind(this));
};

Project.prototype._repair = function (incompatible) {
var that = this;

return this._analyse()
.spread(function (json, tree, flattened) {
var unresolved = {};
var resolved = {};
var isBroken = false;



mout.object.forOwn(flattened, function (decEndpoint, name) {
if (decEndpoint.missing) {
unresolved[name] = decEndpoint;
isBroken = true;
} else if (incompatible && decEndpoint.incompatible) {
unresolved[name] = decEndpoint;
isBroken = true;
} else {
resolved[name] = decEndpoint;
}
});


if (!isBroken) {
return {};
}



return that._manager
.configure(unresolved, resolved)
.resolve()

.then(function () {
return that._manager.install();
});
});
};

Project.prototype._readJson = function () {
var deferred = Q.defer();




Q.nfcall(bowerJson.find, this._config.cwd)
.then(function (filename) {

if (path.basename(filename) === 'component.json') {
process.nextTick(function () {
deferred.notify({
type: 'warn',
data: 'You are using the deprecated component.json file'
});
});
}


return Q.nfcall(bowerJson.read, filename)
.fail(function (err) {
throw createError('Something went wrong while reading "' + filename + '"', err.code, {
details: err.message
});
});
}, function () {

return Q.nfcall(bowerJson.parse, { name: path.basename(this._config.cwd) });
}.bind(this))
.then(deferred.resolve, deferred.reject, deferred.notify);

return deferred.promise;
};

Project.prototype._readInstalled = function () {
var componentsDir = path.join(this._config.cwd, this._config.directory);




return Q.nfcall(glob, '*/.bower.json', {
cwd: componentsDir,
dot: true
})
.then(function (filenames) {
var promises = [];


filenames.forEach(function (filename) {
var promise;
var name = path.dirname(filename);


promise = Q.nfcall(fs.readFile, path.join(componentsDir, filename))
.then(function (contents) {
var json = JSON.parse(contents.toString());
var dir = path.join(componentsDir, name);


return {
name: name,
source: dir,
target: json.version || '*',
json: json,
dir: dir
};
});

promises.push(promise);
});



return Q.all(promises)
.then(function (locals) {
var decEndpoints = {};

locals.forEach(function (decEndpoint) {
decEndpoints[decEndpoint.name] = decEndpoint;
});

return decEndpoints;
});
});
};

Project.prototype._restoreNode = function (node, locals, jsonKey) {


if (node.dependencies || node.missing || node.incompatible) {
return;
}

node.dependencies = {};

mout.object.forOwn(node.json[jsonKey || 'dependencies'], function (value, key) {
var local = locals[key];
var json = endpointParser.json2decomposed(key, value);


if (!local) {
local = endpointParser.json2decomposed(key, value);
local.missing = true;
locals[key] = local;

