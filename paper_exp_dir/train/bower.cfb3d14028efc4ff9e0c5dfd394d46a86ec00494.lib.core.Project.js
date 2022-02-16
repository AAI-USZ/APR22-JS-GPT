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



Project.prototype.install = function (endpoints) {
var repairResult;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}



if (!endpoints) {
return this._repair(true)
.fin(function () {
that._working = false;
});
}


return this._repair()

.then(function (result) {
repairResult = result;
return that._analyse();
})
.spread(function (json, tree, flattened) {
var targetNames = {};
var targets = [];
var installed = {};


endpoints.forEach(function (target) {
var decEndpoint = endpointParser.decompose(target);
targetNames[decEndpoint.name] = true;
targets.push(decEndpoint);
});






mout.object.forOwn(flattened, function (decEndpoint, name) {
if (targetNames[name]) {
return;
}

installed[name] = decEndpoint.pkgMeta;
});


return that._manager
.configure(targets, installed)
.resolve()

.then(function () {
return that._manager.install();
})


.then(function (result) {
return mout.object.fillIn(result, repairResult);
});
})
.fin(function () {
that._working = false;
});
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
var flattened = installed;

root = {
name: json.name,
pkgMeta: json
};



this._restoreNode(root, flattened);

if (!this._options.production) {
this._restoreNode(root, flattened, 'devDependencies');
}

return [json, root, flattened];
}.bind(this));
};

Project.prototype._repair = function (incompatible) {
var that = this;

return this._analyse()
.spread(function (json, tree, flattened) {
var targets = [];
var installed = {};
var isBroken = false;



mout.object.forOwn(flattened, function (decEndpoint, name) {
if (decEndpoint.missing) {
targets.push(decEndpoint);
isBroken = true;
} else if (incompatible && decEndpoint.incompatible) {
targets.push(decEndpoint);
isBroken = true;
} else {
installed[name] = decEndpoint.pkgMeta;
}
});


if (!isBroken) {
return {};
}


return that._manager
.configure(targets, installed)
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
level: 'warn',
tag: 'deprecated',
json: filename,
data: 'You are using the deprecated component.json file'
});
});
}


return Q.nfcall(bowerJson.read, filename)
