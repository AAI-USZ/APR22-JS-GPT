













var spawn    = require('child_process').spawn;
var _        = require('underscore');
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
return fs.rename(this.path, this.localPath, function (err) {
if(err && err.code === 'EXDEV'){
var reader = fstream.Reader(this.path).pipe(
fstream.Writer({
type: 'Directory',
path: this.localPath
})
);
reader.on('error', this.emit.bind(this, 'error'));
reader.on('end', function(){
rimraf(this.path,function(err){
this.cleanUpLocal.bind(this);
