'use strict';

const Promise = require('bluebird');
const { sep, join, dirname } = require('path');
const tildify = require('tildify');
const Database = require('warehouse');
const _ = require('lodash');
const chalk = require('chalk');
const { EventEmitter } = require('events');
const fs = require('hexo-fs');
const Module = require('module');
const vm = require('vm');
const pkg = require('../../package.json');
const logger = require('hexo-log');
const extend = require('../extend');
const Render = require('./render');
const registerModels = require('./register_models');
const Post = require('./post');
const Scaffold = require('./scaffold');
const Source = require('./source');
const Router = require('./router');
const Theme = require('../theme');
const Locals = require('./locals');
const defaultConfig = require('./default_config');
const loadDatabase = require('./load_database');
const multiConfigPath = require('./multi_config_path');
const resolve = require('resolve');
const full_url_for = require('../plugins/helper/full_url_for');
const { inherits } = require('util');

const { cloneDeep, debounce } = _;

const libDir = dirname(__dirname);
const dbVersion = 1;

const stopWatcher = box => { if (box.isWatching()) box.unwatch(); };

const routeCache = new WeakMap();

