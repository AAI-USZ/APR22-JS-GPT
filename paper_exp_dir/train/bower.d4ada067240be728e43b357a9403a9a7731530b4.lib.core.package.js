













var fstream    = require('fstream');
var mkdirp     = require('mkdirp');
var events     = require('events');
var rimraf     = require('rimraf');
var semver     = require('semver');
var async      = require('async');
var https      = require('https');
var http       = require('http');
var path       = require('path');
var glob       = require('glob');
var url        = require('url');
var tmp        = require('tmp');
var fs         = require('fs');
var crypto     = require('crypto');
var unzip      = require('unzip');
var tar        = require('tar');
var _          = require('lodash');

var config     = require('./config');
var source     = require('./source');
var template   = require('../util/template');
var readJSON   = require('../util/read-json');
var fileExists = require('../util/file-exists');
var isRepo     = require('../util/is-repo');
var git        = require('../util/git-cmd');
var UnitWork   = require('./unit_work');

var Package = function (name, endpoint, manager) {
this.dependencies = {};
this.json         = {};
this.name         = name;
this.manager      = manager;
this.unitWork     = manager ? manager.unitWork : new UnitWork;
this.opts         = manager ? manager.opts : {};

if (endpoint) {
var split;

if (/^(.*\.git)$/.exec(endpoint)) {
this.gitUrl = RegExp.$1.replace(/^git\+/, '');
this.tag    = false;

} else if (/^(.*\.git)#(.*)$/.exec(endpoint)) {
this.tag    = RegExp.$2;
this.gitUrl = RegExp.$1.replace(/^git\+/, '');

} else if (/^(?:(git):|git\+(https?):)\/\/([^#]+)#?(.*)$/.exec(endpoint)) {
this.gitUrl = (RegExp.$1 || RegExp.$2) + '://' + RegExp.$3;
this.tag    = RegExp.$4;

} else if (semver.validRange(endpoint)) {
this.tag = endpoint;

} else if (/^[\.\/~]\.?[^.]*\.(js|css)/.test(endpoint) && fs.statSync(endpoint).isFile()) {
this.path      = path.resolve(endpoint);
this.assetType = path.extname(endpoint);

} else if (/^https?:\/\
this.assetUrl  = endpoint;
this.assetType = path.extname(endpoint);

} else if (fileExists.sync((split = endpoint.split('#', 2))[0]) && fs.statSync(split[0]).isDirectory()) {
this.path = path.resolve(split[0]);
this.tag  = split[1];

} else if (/^[\.\/~]/.test(endpoint)) {
this.path = path.resolve(endpoint);

} else if (endpoint.split('/').length === 2) {
split = endpoint.split('#', 2);
this.gitUrl = 'git://github.com/' + split[0] + '.git';
this.tag = split[1];
} else {
split = endpoint.split('#', 2);
this.tag = split[1];
}


if (!this.name) {
if (this.gitUrl) this.name = path.basename(endpoint).replace(/(\.git)?(#.*)?$/, '');
else if (this.path) this.name = path.basename(this.path, this.assetType);
else if (this.assetUrl) this.name = this.name = path.basename(this.assetUrl, this.assetType);
else if (split) this.name = split[0];
}



if (this.tag) this.originalTag = this.tag;
if (this.path) this.originalPath = endpoint;


this.id = crypto.createHash('md5').update(this.name + '%' + this.tag + '%' + this.gitUrl +  '%' + this.path + '%' + this.assetUrl).digest('hex');


if (this.gitUrl) this.generateResourceId();
}

if (this.manager) {
this.on('data',  this.manager.emit.bind(this.manager, 'data'));
this.on('error', function (err, origin) {

if (!origin && this.unitWork.isLocked(this.name)) this.unitWork.unlock(this.name, this);
this.manager.emit('error', err, origin || this);
}.bind(this));
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
this.emit('resolve');
return this;
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
this.lookedUp = true;
this.gitUrl = url;
this.generateResourceId();
this.emit('lookup');
}.bind(this));
};

Package.prototype.install = function () {

if (this.unitWork.retrieve(this.name)) {
template('action', { name: 'installing', shizzle: this.name + (this.version ? '#' + this.version : '') })
.on('data', this.emit.bind(this, 'data'));
}

var localPath = this.localPath;

if (path.resolve(this.path) === localPath) {
this.emit('install');
return this;
}




isRepo(localPath, function (is) {
if (is) {
var err = new Error('Local path is a local repository');
err.details = 'To avoid losing work, please remove ' + localPath + ' manually.';
return this.emit('error', err, this);
}

mkdirp(path.dirname(localPath), function (err) {
if (err) return this.emit('error', err);
rimraf(localPath, function (err) {
if (err) return this.emit('error', err);
return fs.rename(this.path, localPath, function (err) {
if (!err) return this.cleanUpLocal();

var writter = fstream.Writer({
type: 'Directory',
path: localPath
});
writter
.on('error', this.emit.bind(this, 'error'))
.on('end', rimraf.bind(this, this.path, this.cleanUpLocal.bind(this)));

fstream.Reader(this.path)
.on('error', this.emit.bind(this, 'error'))
.pipe(writter);
}.bind(this));
}.bind(this));
}.bind(this));
}.bind(this));

return this;
};

Package.prototype.cleanUpLocal = function () {
this.once('readLocalConfig', function () {
this.json.name    = this.name;
this.json.version = this.commit ? '0.0.0' : this.version || '0.0.0';


if (this.commit) this.json.commit = this.commit;
else delete this.json.commit;

if (this.gitUrl) this.json.repository = { type: 'git', url: this.gitUrl };
else if (this.gitPath) this.json.repository = { type: 'local-repo', path: this.originalPath };
else if (this.originalPath) this.json.repository = { type: 'local', path: this.originalPath };
else if (this.assetUrl) this.json = this.generateAssetJSON();

var jsonStr = JSON.stringify(this.json, null, 2);

fs.writeFile(path.join(this.localPath, this.localConfig.json), jsonStr);
if (this.gitUrl || this.gitPath) fs.writeFile(path.join(this.gitPath, this.localConfig.json), jsonStr);

this.removeLocalPaths();
}.bind(this)).readLocalConfig();
};


Package.prototype.removeLocalPaths = function () {
var removePatterns = ['.git'];
if (this.json.ignore) {
removePatterns.push.apply(removePatterns, this.json.ignore);
}

var removePaths = [];


var pathsRemoved = function (err) {
if (err) return this.emit('error', err);
this.emit('install');
}.bind(this);


var rimrafPaths = function (err) {
if (err) return this.emit('error', err);
async.forEach(removePaths, function (removePath, next) {

rimraf(path.join(this.localPath, removePath), next);
}.bind(this), pathsRemoved);
}.bind(this);


var globOpts = { dot: true, cwd: this.localPath };
async.forEach(removePatterns, function (removePattern, next) {

glob(removePattern, globOpts, function (err, globPaths) {
if (err) return next(err);
removePaths.push.apply(removePaths, globPaths);
next();
