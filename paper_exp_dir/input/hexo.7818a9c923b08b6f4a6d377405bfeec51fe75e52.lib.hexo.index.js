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

const { cloneDeep, debounce } = _;

const libDir = dirname(__dirname);
const dbVersion = 1;

function Hexo(base = process.cwd(), args = {}) {
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
version: pkg.version,
init: false
};

this.extend = {
console: new extend.Console(),
deployer: new extend.Deployer(),
filter: new extend.Filter(),
generator: new extend.Generator(),
helper: new extend.Helper(),
migrator: new extend.Migrator(),
processor: new extend.Processor(),
renderer: new extend.Renderer(),
tag: new extend.Tag()
};

this.config = cloneDeep(defaultConfig);

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

this.config_path = args.config ? mcp(base, args.config, args.output) :
join(base, '_config.yml');

registerModels(this);

this.source = new Source(this);
this.theme = new Theme(this);
this.locals = new Locals(this);
this._bindLocals();
}

require('util').inherits(Hexo, EventEmitter);

Hexo.prototype._bindLocals = function() {
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

locals.set('categories', () => db.model('Category'));

locals.set('tags', () => db.model('Tag'));

locals.set('data', () => {
const obj = {};

db.model('Data').forEach(data => {
obj[data._id] = data.data;
});

return obj;
});
};

Hexo.prototype.init = function() {
this.log.debug('Hexo version: %s', chalk.magenta(this.version));
this.log.debug('Working directory: %s', chalk.magenta(tildify(this.base_dir)));


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
'load_plugins'
], name => require(`./${name}`)(this)).then(() => this.execFilter('after_init', null, {context: this})).then(() => {

this.emit('ready');
});
};

Hexo.prototype.call = function(name, args, callback) {
if (!callback && typeof args === 'function') {
callback = args;
args = {};
}

return new Promise((resolve, reject) => {
const c = this.extend.console.get(name);

if (c) {
Reflect.apply(c, this, [args]).then(resolve, reject);
} else {
reject(new Error(`Console \`${name}\` has not been registered yet!`));
}
}).asCallback(callback);
};

Hexo.prototype.model = function(name, schema) {
return this.database.model(name, schema);
};

Hexo.prototype.resolvePlugin = function(name) {
const baseDir = this.base_dir;

try {

return resolve.sync(name, { basedir: baseDir });
} catch (err) {


return join(baseDir, 'node_modules', name);
}
};

Hexo.prototype.loadPlugin = function(path, callback) {
return fs.readFile(path).then(script => {

const module = new Module(path);
module.filename = path;
module.paths = Module._nodeModulePaths(path);

function require(path) {
return module.require(path);
}

require.resolve = request => Module._resolveFilename(request, module);

require.main = process.mainModule;
require.extensions = Module._extensions;
require.cache = Module._cache;

script = `(function(exports, require, module, __filename, __dirname, hexo){${script}});`;

const fn = vm.runInThisContext(script, path);

return fn(module.exports, require, module, path, dirname(path), this);
}).asCallback(callback);
};

Hexo.prototype._showDrafts = function() {
const { args } = this.env;
return args.draft || args.drafts || this.config.render_drafts;
};

Hexo.prototype.load = function(callback) {
return loadDatabase(this).then(() => {
this.log.info('Start processing');

return Promise.all([
this.source.process(),
this.theme.process()
]);
}).then(() => this._generate({cache: true})).asCallback(callback);
};

Hexo.prototype.watch = function(callback) {
this._watchBox = debounce(() => this._generate({cache: false}), 100);

return loadDatabase(this).then(() => {
this.log.info('Start processing');

return Promise.all([
this.source.watch(),
this.theme.watch()
]);
}).then(() => {
this.source.on('processAfter', this._watchBox);
this.theme.on('processAfter', this._watchBox);

return this._generate({cache: false});
}).asCallback(callback);
};

Hexo.prototype.unwatch = function() {
if (this._watchBox != null) {
this.source.removeListener('processAfter', this._watchBox);
this.theme.removeListener('processAfter', this._watchBox);

this._watchBox = null;
}

stopWatcher(this.source);
stopWatcher(this.theme);
};

function stopWatcher(box) {
if (box.isWatching()) box.unwatch();
}

Hexo.prototype._generateLocals = function() {
const { config, theme } = this;
