var util = require('hexo-util');
var Promise = require('bluebird');
var pathFn = require('path');
var tildify = require('tildify');
var Database = require('warehouse');
var _ = require('lodash');
var chalk = require('chalk');
var EventEmitter = require('events').EventEmitter;
var fs = require('hexo-fs');
var Module = require('module');
var vm = require('vm');
var pkg = require('../../package.json');
var createLogger = require('./create_logger');
var extend = require('../extend');
var Render = require('./render');
var registerModels = require('./register_models');
var Post = require('./post');
var Scaffold = require('./scaffold');
var Source = require('./source');
var Router = require('./router');
var defaultConfig = require('./default_config');

var libDir = pathFn.dirname(__dirname);
var dbVersion = 1;

function Hexo(base, args){
base = base || process.cwd();
args = args || {};

EventEmitter.call(this);

var self = this;

this.base_dir = base + pathFn.sep;
this.public_dir = pathFn.join(base, 'public') + pathFn.sep;
this.source_dir = pathFn.join(base, 'source') + pathFn.sep;
this.plugin_dir = pathFn.join(base, 'node_modules') + pathFn.sep;
this.script_dir = pathFn.join(base, 'scripts') + pathFn.sep;
this.scaffold_dir = pathFn.join(base, 'scaffolds') + pathFn.sep;

this.env = {
