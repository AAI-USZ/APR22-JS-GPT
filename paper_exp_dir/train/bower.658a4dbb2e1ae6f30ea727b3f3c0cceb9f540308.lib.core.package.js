













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
var hogan      = require('hogan.js');

var config     = require('./config');
var source     = require('./source');
var template   = require('../util/template');
var readJSON   = require('../util/read-json');
var fileExists = require('../util/file-exists');
var fallback   = require('../util/fallback');
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
this.explicitName = true;

var split;

if (endpoint) {
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
this.explicitName = false;

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
this.gitUrl = this.resolveShorthand(config.shorthand_resolver, (split = endpoint.split('#', 2))[0]);
this.tag = split[1];
this.shorthand = endpoint;

} else {
split = endpoint.split('#', 2);
this.tag = split[1];
}


if (!this.name) {
this.name = this.guessName(split && split[0]);
this.explicitName = false;
} else {
this.explicitName = true;
}

this.cacheName = this.name;



if (this.tag) this.originalTag = this.tag;
if (this.path) this.originalPath = endpoint;
if (this.assetUrl) this.originalAssetUrl = this.assetUrl;


this.id = crypto.createHash('md5').update(this.name + '%' + this.tag + '%' + this.gitUrl +  '%' + this.path + '%' + this.assetUrl).digest('hex');


if (this.gitUrl) this.generateResourceId();
}

if (this.manager) {
this.on('data',  this.manager.emit.bind(this.manager, 'data'));
this.on('warn',  this.manager.emit.bind(this.manager, 'warn'));
this.on('error', function (err, origin) {

if (!origin && this.unitWork.isLocked(this.cacheName)) this.unitWork.unlock(this.cacheName, this);

this.manager.emit('error', err, origin || this);
}.bind(this));
}


this.waitUnlock = this.waitUnlock.bind(this);

this.setMaxListeners(30);
};

Package.prototype = Object.create(events.EventEmitter.prototype);

Package.prototype.constructor = Package;

Package.prototype.resolve = function () {




if (!this.cacheName) {
return this.emit('error', new Error('Could not determine an endpoint or version for ' + this.name));
}



if (this.unitWork.isLocked(this.cacheName)) return this.unitWork.on('unlock', this.waitUnlock);

var data = this.unitWork.retrieve(this.cacheName);
if (data) {


if (data.id === this.id) {
this.unserialize(data);
this.emit('resolve');
return this;
}
}


this.unitWork.lock(this.cacheName, this);

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

if (this.unitWork.retrieve(this.cacheName)) {
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


async.parallel({
'local': function (next) {
fs.writeFile(path.join(this.localPath, this.localConfig.json), jsonStr, next);
}.bind(this),
'git-path': function (next) {
if (!this.gitPath) return next();
fileExists(this.gitPath, function (exists) {
if (!exists) return next();
fs.writeFile(path.join(this.gitPath, this.localConfig.json), jsonStr, next);
}.bind(this));
}.bind(this)
}, function (err) {
if (err) return this.emit('error', err);
this.removeLocalPaths();
}.bind(this));

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
}.bind(this));
}.bind(this), rimrafPaths);
};

Package.prototype.generateAssetJSON = function () {
return {
name: this.name,
main: this.assetType !== '.zip' && this.assetType !== '.tar' ? 'index' + this.assetType : '',
version: '0.0.0',
repository: { type: 'asset', url: this.originalAssetUrl }
};
};

Package.prototype.uninstall = function () {
template('action', { name: 'uninstalling', shizzle: this.path })
.on('data', this.emit.bind(this, 'data'));
rimraf(this.path, function (err) {
if (err) return this.emit('error', err);
this.emit('uninstall');
}.bind(this));
};


Package.prototype.guessName = function (fallback) {
if (this.gitUrl) return path.basename(this.gitUrl).replace(/(\.git)?(#.*)?$/, '');
if (this.path) return path.basename(this.path, this.assetType);
if (this.assetUrl) return path.basename(this.assetUrl, this.assetType);
return fallback;
};

Package.prototype.findJSON = function () {
fallback(this.path, [config.json, 'bower.json', 'component.json'], function (name) {
if (name) {
if (name === 'component.json') {
this.emit('warn', 'Package ' + this.name + ' is still using the deprecated "component.json" file');
}
this.localConfig.json = name;
}
this.emit('readLocalConfig');
}.bind(this));
};

Package.prototype.readLocalConfig = function () {
if (this.localConfig) return this.emit('readLocalConfig');

fs.readFile(path.join(this.path, '.bowerrc'), function (err, file) {


if (err) {
this.localConfig = { json: config.json };
this.findJSON();
} else {


try {
this.localConfig = JSON.parse(file);
} catch (e) {
return this.emit('error', new Error('Unable to parse local .bowerrc file: ' + e.message));
}

if (!this.localConfig.json) {
this.localConfig.json = config.json;
return this.findJSON();
}

this.emit('readLocalConfig');
}
}.bind(this));
};

Package.prototype.loadJSON = function () {
if (!this.path || this.assetUrl) return this.emit('loadJSON');

this.once('readLocalConfig', function () {
var jsonFile = path.join(this.path, this.localConfig.json);
fileExists(jsonFile, function (exists) {

if (!exists) {
return this.once('describeTag', function (tag) {
tag = semver.clean(tag);
if (!tag) this.version = this.tag;
else {
this.version = tag;
if (!this.tag) this.tag = this.version;
}

this.emit('loadJSON');
}.bind(this)).describeTag();
}

readJSON(jsonFile, function (err, json) {
if (err) {
err.details = 'An error was caught when reading the ' + this.localConfig.json + ': ' + err.message;
return this.emit('error', err);
}

this.json    = json;
this.version = this.commit || json.commit || json.version;
this.commit  = this.commit || json.commit;


if (!this.name || !this.explicitName) {
this.name = json.name;
}


this.readEndpoint();



var cleanedTag;
if (this.tag && (cleanedTag = semver.clean(this.tag)) && cleanedTag !== this.version) {

if (!this.unitWork.retrieve('mismatch#' + this.cacheName + '_' + cleanedTag)) {
template('warning-mismatch', { name: this.cacheName, json: this.localConfig.json, tag: cleanedTag, version: this.version || 'N/A' })
.on('data', this.emit.bind(this, 'data'));
this.unitWork.store('mismatch#' + this.cacheName + '_' + cleanedTag, true);
}

this.version = cleanedTag;
}

this.emit('loadJSON');
}.bind(this), this);
}.bind(this));
}.bind(this)).readLocalConfig();
};

Package.prototype.getAssetType = function (headers) {
var assetType;
var matches;
var contentType = headers['content-type'];
var contentDisposition = headers['content-disposition'];

if (contentType) {
contentType = contentType.split(';')[0].trim();
switch (contentType.toLowerCase()) {
case 'application/zip':
assetType = '.zip';
break;
case 'application/x-tar':
assetType = '.tar';
break;
case 'application/x-tgz':
assetType = '.tar.gz';
break;
case 'application/x-gzip':
assetType = '.gz';
break;
}
}

if (!assetType && contentDisposition) {
matches = contentDisposition.match(/filename="?(.+?)"?$/i);
if (matches && matches[1]) {
if (/\.tar\.gz$/.test(matches[1])) {
assetType = '.tar.gz';
} else {
assetType = path.extname(matches[1]);
}
}
}

return assetType;
};

Package.prototype.download = function () {
template('action', { name: 'downloading', shizzle: this.assetUrl })
.on('data', this.emit.bind(this, 'data'));

var src;

if (config.proxy) {
src = url.parse(config.proxy);
src.path = this.assetUrl;
} else {
src  = url.parse(this.assetUrl);
}

src.agent = false;

tmp.dir({
prefix: 'bower-' + this.name + '-',
mode: parseInt('0777', 8) & (~process.umask()),
unsafeCleanup: true
}, function (err, tmpPath) {
if (err) return this.emit('error', err);

var req  = src.protocol === 'https:' ? https : http;
