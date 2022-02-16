'use strict';

const Promise = require('bluebird');
const { sep, join, dirname } = require('path');
const tildify = require('tildify');
const Database = require('warehouse');
const { magenta, underline } = require('chalk');
const { EventEmitter } = require('events');
const { readFile } = require('hexo-fs');
const Module = require('module');
const { runInThisContext } = require('vm');
const { version } = require('../../package.json');
const logger = require('hexo-log');
const { Console, Deployer, Filter, Generator, Helper, Injector, Migrator, Processor, Renderer, Tag } = require('../extend');
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
const { deepMerge, full_url_for } = require('hexo-util');

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
.then(result => ctx.extend.injector.exec(result, locals))
.then(result => ctx.execFilter('_after_html_render', result, {
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

function debounce(func, wait) {
let timeout;
return function() {
const context = this;
const args = arguments;
clearTimeout(timeout);
timeout = setTimeout(() => {
func.apply(context, args);
}, wait);
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
injector: new Injector(),
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

if (/^(init|new|g|publish|s|deploy|render|migrate)/.test(this.env.cmd)) {
this.log.d(`Writing database to ${dbPath}/db.json`);
}

this.database = new Database({
version: dbVersion,
path: join(dbPath, 'db.json')
});

const mcp = multiConfigPath(this);

