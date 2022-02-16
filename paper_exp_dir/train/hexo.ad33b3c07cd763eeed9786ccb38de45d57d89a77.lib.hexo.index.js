'use strict';

const Promise = require('bluebird');
const pathFn = require('path');
const tildify = require('tildify');
const Database = require('warehouse');
const _ = require('lodash');
const chalk = require('chalk');
const EventEmitter = require('events').EventEmitter;
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

const libDir = pathFn.dirname(__dirname);
const sep = pathFn.sep;
const dbVersion = 1;

function Hexo(base = process.cwd(), args = {}) {
EventEmitter.call(this);

this.base_dir = base + sep;
this.public_dir = pathFn.join(base, 'public') + sep;
this.source_dir = pathFn.join(base, 'source') + sep;
this.plugin_dir = pathFn.join(base, 'node_modules') + sep;
this.script_dir = pathFn.join(base, 'scripts') + sep;
this.scaffold_dir = pathFn.join(base, 'scaffolds') + sep;
this.theme_dir = pathFn.join(base, 'themes', defaultConfig.theme) + sep;
this.theme_script_dir = pathFn.join(this.theme_dir, 'scripts') + sep;

