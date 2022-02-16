var EventEmitter = require('events').EventEmitter,
  domain = require('domain'),
  path = require('path'),
  util = require('util'),
  term = require('term'),
  Log = require('./log'),
  Router = require('./router'),
  Extend = require('./extend'),
  create = require('./create'),
  version = require('../package.json').version,
  env = process.env;

var Hexo = module.exports = function(baseDir, args){
  var config = this.config = {};

  this.base_dir = baseDir;
  this.public_dir = path.join(baseDir, 'public');
  this.source_dir = path.join(baseDir, 'source');
  this.plugin_dir = path.join(baseDir, 'node_modules');
  this.script_dir = path.join(baseDir, 'scripts');

  this.__defineGetter__('theme_dir', function(){
    return path.join(baseDir, 'themes', config.theme);
  });

  var debug = this.debug = !!args.debug;
  this.safe = !!args.save;
  this.init = false;

  var log = this.log = new Log({hide: args.debug ? 9 : 7});
  this.route = new Router();

  if (debug){
    log.setFormat('[:level] ' + ':date[HH:mm:ss]'.blackBright + ' :message');
  } else {
    log.setFormat('[:level] :message');
  }

  var extend = this.extend = new Extend();

  [
    'console',
    'deployer',
    'filter',
    'generator',
    'helper',
    'migrator',
    'processor',
    'renderer',
    'swig',
    'tag'
  ].forEach(function(item){
    extend.module(item, require('./extend/' + item));
  });
};

var proto = Hexo.prototype;

proto.__proto__ = EventEmitter.prototype;

proto.core_dir = path.dirname(__dirname);
proto.lib_dir = __dirname;
proto.env = env;
proto.version = version;
proto.util = util;
proto.create = create;

proto.call = function(name, args, callback){
  if (!callback){
    if (typeof args === 'function'){
      callback = args;
      args = {};
    } else {
      callback = function(){};
    }
  }

  var extend = this.extend.console,
    console = extend.store[name] || extend.alias[name];

  name = name.toLowerCase();

  if (console){
    var d = domain.create();

    d.on('error', function(err){
      d.dispose();
      callback(err);
    });

    d.run(function(){
      console(args, callback);
    });
  } else {
    callback(new Error('Console `' + name + '` not found'));
  }

  return this;
};