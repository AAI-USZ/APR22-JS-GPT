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
const { deepMerge } = require('hexo-util');

const libDir = dirname(__dirname);
const dbVersion = 1;

const stopWatcher = box => { if (box.isWatching()) box.unwatch(); };

const routeCache = new WeakMap();

const castArray = obj => { return Array.isArray(obj) ? obj : [obj]; };

const createLoadThemeRoute = function(generatorResult, locals, ctx) {
const { log, theme } = ctx;
const { path, cache: useCache } = locals;

const layout = [...new Set(castArray(generatorResult.layout))];
const layoutLength = layout.length;


locals.cache = true;
return () => {
if (useCache && routeCache.has(generatorResult)) return routeCache.get(generatorResult);

for (let i = 0; i < layoutLength; i++) {
const name = layout[i];
const view = theme.getView(name);

if (view) {
log.debug(`Rendering HTML ${name}: ${magenta(path)}`);
return view.render(locals)
.then(result => ctx.execFilter('after_route_render', result, {
context: ctx,
args: [locals]
}))
.tap(result => {
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

class Hexo extends EventEmitter {
constructor(base = process.cwd(), args = {}) {
super();

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
cmd: args._ ? args._[0] : '',
init: false
};

this.extend = {
console: new Console(),
deployer: new Deployer(),
filter: new Filter(),
generator: new Generator(),
helper: new Helper(),
migrator: new Migrator(),
processor: new Processor(),
renderer: new Renderer(),
tag: new Tag()
};

this.config = { ...defaultConfig };

this.log = logger(this.env);

this.render = new Render(this);

this.route = new Router();

this.post = new Post(this);

this.scaffold = new Scaffold(this);

this._dbLoaded = false;

this._isGenerating = false;



const dbPath = args.output || base;

this.log.d(`Writing database to ${dbPath}/db.json`);

this.database = new Database({
version: dbVersion,
path: join(dbPath, 'db.json')
});

const mcp = multiConfigPath(this);

this.config_path = args.config ? mcp(base, args.config, args.output)
: join(base, '_config.yml');

registerModels(this);

this.source = new Source(this);
this.theme = new Theme(this);
this.locals = new Locals(this);
this._bindLocals();
}

_bindLocals() {
const db = this.database;
const { locals } = this;

locals.set('posts', () => {
const query = {};

if (!this.config.future) {
query.date = {$lte: Date.now()};
}

if (!this._showDrafts()) {
query.published = true;
}

return db.model('Post').find(query);
});

locals.set('pages', () => {
const query = {};

if (!this.config.future) {
query.date = {$lte: Date.now()};
}

return db.model('Page').find(query);
});

locals.set('categories', () => {

return db.model('Category').filter(category => category.length);
});

locals.set('tags', () => {

return db.model('Tag').filter(tag => tag.length);
});

locals.set('data', () => {
const obj = {};

db.model('Data').forEach(data => {
obj[data._id] = data.data;
});

return obj;
});
}

init() {
this.log.debug('Hexo version: %s', magenta(this.version));
this.log.debug('Working directory: %s', magenta(tildify(this.base_dir)));


require('../plugins/console')(this);
require('../plugins/filter')(this);
require('../plugins/generator')(this);
require('../plugins/helper')(this);
require('../plugins/processor')(this);
require('../plugins/renderer')(this);
require('../plugins/tag')(this);


return Promise.each([
'update_package',
'load_config',
'load_theme_config',
'load_plugins'
], name => require(`./${name}`)(this)).then(() => this.execFilter('after_init', null, {context: this})).then(() => {

this.emit('ready');
});
}

call(name, args, callback) {
if (!callback && typeof args === 'function') {
