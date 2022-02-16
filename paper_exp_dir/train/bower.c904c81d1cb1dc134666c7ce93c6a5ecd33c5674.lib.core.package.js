













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
if (this.gitUrl) this.name = path.basename(endpoint).replace(/(\.git)?(#.*)?$/, '');
else if (this.path) this.name = path.basename(this.path, this.assetType);
else if (this.assetUrl) this.name = this.name = path.basename(this.assetUrl, this.assetType);
else if (split) this.name = split[0];

this.explicitName = false;
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
