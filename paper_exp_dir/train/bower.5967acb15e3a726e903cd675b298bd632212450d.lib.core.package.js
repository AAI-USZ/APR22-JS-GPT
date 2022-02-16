













var spawn    = require('child_process').spawn;
var _        = require('lodash');
var fstream  = require('fstream');
var mkdirp   = require('mkdirp');
var events   = require('events');
var rimraf   = require('rimraf');
var semver   = require('semver');
var async    = require('async');
var https    = require('https');
var http     = require('http');
var path     = require('path');
var url      = require('url');
var tmp      = require('tmp');
var fs       = require('fs');

var config   = require('./config');
var source   = require('./source');
var template = require('../util/template');
var readJSON = require('../util/read-json');
var UnitWork = require('./unit_work');

var cache    = config.cache;

var Package = function (name, endpoint, manager) {
this.dependencies  = {};
this.json          = {};
this.name          = name;
this.manager       = manager;
this.unitWork      = manager && manager.unitWork ? manager.unitWork : new UnitWork;
this.opts          = manager ? manager.opts : { force: false };

if (endpoint) {

if (/^(.*\.git)$/.exec(endpoint)) {
this.gitUrl = RegExp.$1.replace(/^git\+/, '');
this.tag    = false;

} else if (/^(.*\.git)#(.*)$/.exec(endpoint)) {
this.tag    = RegExp.$2;
this.gitUrl = RegExp.$1.replace(/^git\+/, '');

} else if (/^(?:(git):|git\+(https?):)\/\/([^#]+)#?(.*)$/.exec(endpoint)) {
this.gitUrl = (RegExp.$1 || RegExp.$2) + "://" + RegExp.$3;
this.tag    = RegExp.$4;

} else if (semver.validRange(endpoint)) {
this.tag = endpoint;

} else if (/^[\.\/~]\.?[^.]*\.(js|css)/.test(endpoint) && fs.statSync(endpoint).isFile()) {

this.path      = path.resolve(endpoint);
this.assetType = path.extname(endpoint);
this.name      = this.name.replace(this.assetType, '');

} else if (/^[\.\/~]/.test(endpoint)) {
this.path = path.resolve(endpoint);

} else if (/^https?:\/\
this.assetUrl  = endpoint;
this.assetType = path.extname(endpoint);
this.name      = this.name.replace(this.assetType, '');

} else if (fs.existsSync(endpoint)) {
this.path = path.resolve(endpoint);
} else {
this.tag = endpoint.split('#', 2)[1];
}




this.originalTag = this.tag;




this.id = new Buffer(this.name + '%' + this.tag + '%' + this.gitUrl +  '%' + this.path + '%' + this.assetUrl).toString('base64');
this.resourceId = new Buffer(this.gitUrl + '%' + this.path + '%' + this.assetUrl).toString('base64');
}

if (this.manager) {
this.on('data',  this.manager.emit.bind(this.manager, 'data'));
this.on('error', this.manager.emit.bind(this.manager, 'error'));
}


this.waitUnlock = this.waitUnlock.bind(this);

this.setMaxListeners(30);
};

Package.prototype = Object.create(events.EventEmitter.prototype);

Package.prototype.constructor = Package;

Package.prototype.resolve = function () {


if (this.unitWork.isLocked(this.name)) return this.unitWork.on('unlock', this.waitUnlock);

var data = this.unitWork.retrieve(this.name);
if (data) {


if (data.id === this.id) {
this.unserialize(data);
return this.emit('resolve');
}


if (data.resourceId === this.resourceId) {
this.path = data.path;
this.unitWork.lock(this.name, this);
return this.once('loadJSON', this.saveUnit).checkout();
}
}


this.unitWork.lock(this.name, this);

if (this.assetUrl) {
this.download();
} else if (this.gitUrl) {
this.clone();
} else if (this.path) {
this.copy();
} else {
this.once('lookup', this.clone).lookup();
}

return this;
};

Package.prototype.lookup = function () {
source.lookup(this.name, function (err, url) {
if (err) return this.emit('error', err);
this.gitUrl = url;
this.emit('lookup');
}.bind(this));
};

Package.prototype.install = function () {
if (path.resolve(this.path) == this.localPath) return this.emit('install');

template('action', { name: 'installing', shizzle: this.name + (this.version ? '#' + this.version : '') })
.on('data', this.emit.bind(this, 'data'));

mkdirp(path.dirname(this.localPath), function (err) {
if (err) return this.emit('error', err);
rimraf(this.localPath, function (err) {
if (err) return this.emit('error', err);
return fs.rename(this.path, this.localPath, function (err) {
if (!err) return this.cleanUpLocal();
fstream.Reader(this.path)
.on('error', this.emit.bind(this, 'error'))
.on('end', rimraf.bind(this, this.path, this.cleanUpLocal.bind(this)))
.pipe(
fstream.Writer({
type: 'Directory',
path: this.localPath
})
);
}.bind(this));
}.bind(this));
}.bind(this));
};
Package.prototype.cleanUpLocal = function () {
if (!this.json.name) {
this.json.name = this.name;
this.json.version = semver.valid(this.version) ? this.version : '0.0.0';
}
if (this.json.version === '0.0.0' && this.version !== '0.0.0') this.json.commit = this.version;
else delete this.json.commit;

if (this.gitUrl) this.json.repository = { type: "git", url: this.gitUrl };
if (this.assetUrl) this.json = this.generateAssetJSON();

var jsonStr = JSON.stringify(this.json, null, 2);
fs.writeFile(path.join(this.localPath, config.json), jsonStr);
fs.writeFile(path.join(path.resolve(cache, this.name), config.json), jsonStr);

rimraf(path.join(this.localPath, '.git'), this.emit.bind(this, 'install'));
};
Package.prototype.generateAssetJSON = function () {
var semverParser = new RegExp('(' + semver.expressions.parse.toString().replace(/\$?\/\^?/g, '') + ')');
return {
name: this.name,
main: 'index' + this.assetType,
version: semverParser.exec(this.assetUrl) ? RegExp.$1 : "0.0.0",
repository: { type: "asset", url: this.assetUrl }
};
};

Package.prototype.uninstall = function () {
template('action', { name: 'uninstalling', shizzle: this.path })
.on('data', this.emit.bind(this, 'data'));
rimraf(this.path, function (err) {
if (err) return this.emit('error', err);
this.emit.bind(this, 'uninstall');
}.bind(this));
};


Package.prototype.loadJSON = function (name) {
var pathname = name || ( this.assetType ? 'index' + this.assetType : config.json );
var jsonFile = path.join(this.path, pathname);

readJSON(jsonFile, function (err, json) {
if (err) {


if (!name) {
if ( !this.assetType && fs.existsSync(jsonFile)) return this.emit('error', err);
return this.loadJSON('package.json');
}
return this.assetUrl ? this.emit('loadJSON') : this.path && this.on('describeTag', function (tag) {
tag = semver.clean(tag);
if (tag) this.version = this.tag = tag;
else this.version = this.tag;
this.emit('loadJSON');
}.bind(this)).describeTag();
