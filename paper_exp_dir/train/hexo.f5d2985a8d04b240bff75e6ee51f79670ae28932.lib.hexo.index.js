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
const mcp = multiConfigPath(this);

EventEmitter.call(this);

this.base_dir = base + sep;
this.public_dir = pathFn.join(base, 'public') + sep;
this.source_dir = pathFn.join(base, 'source') + sep;
this.plugin_dir = pathFn.join(base, 'node_modules') + sep;
this.script_dir = pathFn.join(base, 'scripts') + sep;
this.scaffold_dir = pathFn.join(base, 'scaffolds') + sep;
this.theme_dir = pathFn.join(base, 'themes', defaultConfig.theme) + sep;
this.theme_script_dir = pathFn.join(this.theme_dir, 'scripts') + sep;

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

this.config = _.cloneDeep(defaultConfig);

this.log = logger(this.env);

this.render = new Render(this);

this.route = new Router();

this.post = new Post(this);

this.scaffold = new Scaffold(this);

this._dbLoaded = false;

this._isGenerating = false;

this.database = new Database({
version: dbVersion,
path: pathFn.join(base, 'db.json')
});

this.config_path = args.config ? mcp(base, args.config) :
pathFn.join(base, '_config.yml');

registerModels(this);

this.source = new Source(this);
this.theme = new Theme(this);
this.locals = new Locals(this);
this._bindLocals();
}

require('util').inherits(Hexo, EventEmitter);

Hexo.prototype._bindLocals = function() {
const db = this.database;
const locals = this.locals;
const self = this;

locals.set('posts', () => {
const query = {};

if (!self.config.future) {
query.date = {$lte: Date.now()};
}

if (!self._showDrafts()) {
query.published = true;
}

return db.model('Post').find(query);
});

locals.set('pages', () => {
const query = {};

if (!self.config.future) {
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
const self = this;

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
], name => require(`./${name}`)(self)).then(() => self.execFilter('after_init', null, {context: self})).then(() => {

self.emit('ready');
});
};

Hexo.prototype.call = function(name, args, callback) {
if (!callback && typeof args === 'function') {
callback = args;
args = {};
}

const self = this;

return new Promise((resolve, reject) => {
const c = self.extend.console.get(name);

if (c) {
c.call(self, args).then(resolve, reject);
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


return pathFn.join(baseDir, 'node_modules', name);
}
};

Hexo.prototype.loadPlugin = function(path, callback) {
