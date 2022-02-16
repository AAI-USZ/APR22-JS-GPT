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
var defaultConfig = require('./default_config');
var loadDatabase = require('./load_database');
var prettyHrtime = require('pretty-hrtime');

var libDir = pathFn.dirname(__dirname);
var sep = pathFn.sep;
var dbVersion = 1;

function Hexo(base, args){
base = base || process.cwd();
args = args || {};

EventEmitter.call(this);

var self = this;

this.base_dir = base + sep;
this.public_dir = pathFn.join(base, 'public') + sep;
this.source_dir = pathFn.join(base, 'source') + sep;
this.plugin_dir = pathFn.join(base, 'node_modules') + sep;
this.script_dir = pathFn.join(base, 'scripts') + sep;
this.scaffold_dir = pathFn.join(base, 'scaffolds') + sep;
this.theme_dir = pathFn.join(base, 'themes', defaultConfig.theme) + sep;
this.theme_script_dir = pathFn.join(this.theme_dir, 'scripts') + sep;

this.env = {
args: args,
debug: Boolean(args.debug),
safe: Boolean(args.safe),
silent: Boolean(args.silent),
env: process.env.NODE_ENV || 'development',
version: pkg.version,
init: false
};

this.config_path = args.config ? pathFn.resolve(base, args.config)
: pathFn.join(base, '_config.yml');

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

this.config = _.clone(defaultConfig);

this.log = createLogger(this.env);

this.render = new Render(this);

this.route = new Router();

this.post = new Post(this);

this.scaffold = new Scaffold(this);

this._dbLoaded = false;

this._isGenerating = false;

var db = this.database = new Database({
version: dbVersion,
path: pathFn.join(base, 'db.json')
});

registerModels(this);

this.locals = {
get posts(){
var query = {};

if (!self.config.future){
query.date = {$lte: Date.now()};
}

if (!self._showDrafts()){
query.published = true;
}

return db.model('Post').find(query);
},
get pages(){
var query = {};

if (!self.config.future){
query.date = {$lte: Date.now()};
}

return db.model('Page').find(query);
},
get categories(){
return db.model('Category');
},
get tags(){
return db.model('Tag');
}
};

this.source = new Source(this);
this.theme = new Theme(this);
}

require('util').inherits(Hexo, EventEmitter);

Hexo.prototype.init = function(){
var self = this;

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
'load_config',
'update_package',
'load_plugins'
], function(name){
return require('./' + name)(self);
}).then(function(){
return self.extend.filter.exec('after_init', null, {context: self});
}).then(function(){

self.emit('ready');
});
};

Hexo.prototype.call = function(name, args, callback){
if (!callback && typeof args === 'function'){
callback = args;
