'use strict';

const Promise = require('bluebird');
const { sep, join, dirname } = require('path');
const tildify = require('tildify');
const Database = require('warehouse');
const _ = require('lodash');
const { magenta, underline } = require('chalk');
const { EventEmitter } = require('events');
const { readFile } = require('hexo-fs');
const Module = require('module');
const { runInThisContext } = require('vm');
const { version } = require('../../package.json');
const logger = require('hexo-log');
const { Console, Deployer, Filter, Generator, Helper, Migrator, Processor, Renderer, Tag } = require('../extend');
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
const { sync } = require('resolve');
const full_url_for = require('../plugins/helper/full_url_for');
const { inherits } = require('util');

const libDir = dirname(__dirname);
const dbVersion = 1;

const stopWatcher = box => { if (box.isWatching()) box.unwatch(); };

const routeCache = new WeakMap();

const unique = array => array.filter((item, index, self) => self.indexOf(item) === index);

const castArray = obj => { return Array.isArray(obj) ? obj : [obj]; };

const createLoadThemeRoute = function(generatorResult, locals, ctx) {
const { log, theme } = ctx;
const { path, cache: useCache } = locals;

const layout = unique(castArray(generatorResult.layout));
const layoutLength = layout.length;


locals.cache = true;
return () => {
if (useCache && routeCache.has(generatorResult)) return routeCache.get(generatorResult);

for (let i = 0; i < layoutLength; i++) {
const name = layout[i];
const view = theme.getView(name);

if (view) {
log.debug(`Rendering HTML ${name}: ${magenta(path)}`);
return view.render(locals).tap(result => {
if (useCache) {
routeCache.set(generatorResult, result);
}
}).tapCatch(err => {
log.error({ err }, `Render HTML failed: ${magenta(path)}`);
});
}
}

log.warn(`No layout: ${magenta(path)}`);
};
};

function debounce(func, wait, immediate) {
let timeout;
return function() {
const context = this;
const args = arguments;
clearTimeout(timeout);
timeout = setTimeout(() => {
timeout = null;
if (!immediate) func.apply(context, args);
}, wait);
if (immediate && !timeout) func.apply(context, args);
};
}

class Hexo {
constructor(base = process.cwd(), args = {}) {
Reflect.apply(EventEmitter, this, []);

this.base_dir = base + sep;
this.public_dir = join(base, 'public') + sep;
this.source_dir = join(base, 'source') + sep;
this.plugin_dir = join(base, 'node_modules') + sep;
this.script_dir = join(base, 'scripts') + sep;
this.scaffold_dir = join(base, 'scaffolds') + sep;
this.theme_dir = join(base, 'themes', defaultConfig.theme) + sep;
this.theme_script_dir = join(this.theme_dir, 'scripts') + sep;

this.env = {
args,
debug: Boolean(args.debug),
safe: Boolean(args.safe),
silent: Boolean(args.silent),
env: process.env.NODE_ENV || 'development',
version,
