'use strict';

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
var Theme = require('../theme');
var Locals = require('./locals');
var defaultConfig = require('./default_config');
var loadDatabase = require('./load_database');

var libDir = pathFn.dirname(__dirname);
var sep = pathFn.sep;
var dbVersion = 1;

function Hexo(base, args){
base = base || process.cwd();
