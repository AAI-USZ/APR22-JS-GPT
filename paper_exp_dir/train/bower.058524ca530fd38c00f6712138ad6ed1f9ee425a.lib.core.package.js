













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

var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
|| process.platform === "win32" ? "c:\\windows\\temp" : "/tmp";

var home = (process.platform === "win32"
? process.env.USERPROFILE
: process.env.HOME) || temp;

var cache = process.platform === "win32"
? path.resolve(process.env.APPDATA || home || temp, "bower-cache")
: path.resolve(home || temp, ".bower");

var Package = function (name, endpoint, manager) {
this.dependencies  = {};
this.json          = {};
this.name          = name;
this.manager       = manager;
this.unitWork      = manager ? manager.unitWork : new UnitWork;
this.opts          = manager ? manager.opts : { force: false };

if (endpoint) {

if (/^(.*\.git)$/.exec(endpoint)) {
this.gitUrl = RegExp.$1.replace(/^git\+/, '');
this.tag    = false;

} else if (/^(.*\.git)#(.*)$/.exec(endpoint)) {
