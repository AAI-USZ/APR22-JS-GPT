













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

var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
|| process.platform === "win32" ? "c:\\windows\\temp" : "/tmp";

var home = (process.platform === "win32"
? process.env.USERPROFILE
: process.env.HOME) || temp;

var cache = process.platform === "win32"
? path.resolve(process.env.APPDATA || home || temp, "bower-cache")
: path.resolve(home || temp, ".bower")

var Package = function (name, endpoint, manager) {
this.dependencies = {};
this.json         = {};
this.name         = name;
this.manager      = manager;

if (endpoint) {

if (/^(.*\.git)$/.exec(endpoint)) {
this.gitUrl = RegExp.$1.replace(/^git\+/, '');
this.tag    = false;

} else if (/^(.*\.git)#(.*)$/.exec(endpoint)) {
this.gitUrl = RegExp.$1.replace(/^git\+/, '');
this.tag    = RegExp.$2;

} else if (/^(?:(git):|git\+(https?):)\/\/([^#]+)#?(.*)$/.exec(endpoint)) {
this.gitUrl = (RegExp.$1 || RegExp.$2) + "://" + RegExp.$3;
this.tag    = RegExp.$4;

} else if (semver.validRange(endpoint)) {
this.tag = endpoint;

} else if (/^[\.\/~]\.?[^.]*\.(js|css)/.test(endpoint)) {
this.path      = path.resolve(endpoint);
this.assetType = path.extname(endpoint);
this.name      = this.name.replace(this.assetType, '');

} else if (/^[\.\/~]/.test(endpoint)) {
this.path = path.resolve(endpoint);

} else if (/^https?:\/\
this.assetUrl  = endpoint;
this.assetType = path.extname(endpoint);
this.name      = this.name.replace(this.assetType, '');

} else {
this.tag = endpoint.split('#', 2)[1];
}
}

if (this.manager) {
this.on('data',  this.manager.emit.bind(this.manager, 'data'));
this.on('error', this.manager.emit.bind(this.manager, 'error'));
}
};

Package.prototype = Object.create(events.EventEmitter.prototype);

Package.prototype.constructor = Package;

Package.prototype.resolve = function () {

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
mkdirp(path.dirname(this.localPath), function (err) {
if (err) return this.emit('error', err);
rimraf(this.localPath, function (err) {
if (err) return this.emit('error', err);
return fs.rename(this.path, this.localPath, function () {
if (this.gitUrl) this.json.repository = { type: "git", url: this.gitUrl };
if (this.assetUrl) this.json = this.generateAssetJSON();
fs.writeFile(path.join(this.localPath, config.json), JSON.stringify(this.json, null, 2));
rimraf(path.join(this.localPath, '.git'), this.emit.bind(this, 'install'));
}.bind(this));
}.bind(this));
}.bind(this));
};

Package.prototype.generateAssetJSON = function () {
var semverParser = new RegExp('(' + semver.expressions.parse.toString().replace(/\$?\/\^?/g, '') + ')');
return {
name: this.name,
main: 'index' + this.assetType,
version: semverParser.exec(this.assetUrl) ? RegExp.$1 : "0.0.0",
repository: { type: "asset", url: this.assetUrl }
}
}

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
readJSON(path.join(this.path, pathname), function (err, json) {
if (err) {
if (!name) return this.loadJSON('package.json');
return this.assetUrl ? this.emit('loadJSON') : this.path && this.on('describeTag', function (tag) {
this.version = this.tag = semver.clean(tag);
this.emit('loadJSON')
}.bind(this)).describeTag();
}
this.json    = json;
this.name    = this.json.name;
this.version = this.json.version;
this.emit('loadJSON');
}.bind(this), this);
}

Package.prototype.download = function () {
template('action', { name: 'downloading', shizzle: this.assetUrl })
.on('data', this.emit.bind(this, 'data'));

var file = '';
var src  = url.parse(this.assetUrl);
var req  = src.protocol === 'https:' ? https : http;

tmp.dir(function (err, tmpPath) {

req.get(src, function (res) {


if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
template('action', { name: 'redirect detected', shizzle: this.assetUrl })
.on('data', this.emit.bind(this, 'data'));
this.assetUrl = res.headers.location;
this.download();
}

res.on('data', function (data) {
file += data;
});

