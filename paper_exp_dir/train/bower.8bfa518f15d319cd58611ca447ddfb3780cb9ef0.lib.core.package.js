













var fstream    = require('fstream');
var mkdirp     = require('mkdirp');
var events     = require('events');
var rimraf     = require('rimraf');
var semver     = require('semver');
var async      = require('async');
var https      = require('https');
var http       = require('http');
var path       = require('path');
var url        = require('url');
var tmp        = require('tmp');
var fs         = require('fs');
var crypto     = require('crypto');
var unzip      = require('unzip');
var tar        = require('tar');

var config     = require('./config');
var source     = require('./source');
var template   = require('../util/template');
var readJSON   = require('../util/read-json');
var fileExists = require('../util/file-exists');
var isRepo     = require('../util/is-repo');
var spawn      = require('../util/spawn');
var UnitWork   = require('./unit_work');

var Package = function (name, endpoint, manager) {
this.dependencies = {};
this.json         = {};
this.name         = name;
this.manager      = manager;
this.unitWork     = manager ? manager.unitWork : new UnitWork;
