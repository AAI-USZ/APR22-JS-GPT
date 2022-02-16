var pathFn = require('path');
var Promise = require('bluebird');
var util = require('../util');

var fs = util.fs;

function Scaffold(context){
  this.context = context;
  this.scaffoldDir = context.scaffold_dir;
  this.assetDir = pathFn.join(context.core_dir, 'assets', 'scaffolds');
}

Scaffold.prototype.defaults = {
  normal: [
    'layout: {{ layout }}',
    'title: {{ title }}',
    'date: {{ date }}',
    'tags:',
    '---'
  ].join('\n')
};

Scaffold.prototype._listDir = function(){
  var scaffoldDir = this.scaffoldDir;

  return fs.listDir(scaffoldDir, {
    ignoreFilesRegex: /^_|\/_/
  }).map(function(item){
    return {
      name: item.substring(0, item.length - pathFn.extname(item).length),
      path: pathFn.join(scaffoldDir, item)
    };
  });
};

Scaffold.prototype._getScaffold = function(name){
  return this._listDir().any(function(item){
    return item.name === name;
  });
};

Scaffold.prototype._getDefaultScaffold = function(name){
  var defaults = this.defaults;
  if (defaults[name]) return Promise.resolve(defaults[name]);

  var path = pathFn.join(this.assetDir, name + '.md');

  return fs.exists(path).then(function(exist){
    if (!exist) return;

    return fs.readFile(path).then(function(content){
      defaults[name] = content;
      return content;
    });
  });
};

Scaffold.prototype.get = function(name, callback){
  var self = this;

  return this._getScaffold(name).then(function(item){
    if (item){
      return fs.readFile(item.path);
    } else {
      return self._getDefaultScaffold(name);
    }
  }).nodeify(callback);
};

Scaffold.prototype.set = function(name, content, callback){
  var scaffoldDir = this.scaffoldDir;

  return this._getScaffold(name).then(function(item){
    var path = item.path || pathFn.join(scaffoldDir, name);
    if (!pathFn.extname(path)) path += '.md';

    return fs.writeFile(path, content);
  }).nodeify(callback);
};

Scaffold.prototype.remove = function(name, callback){
  return this._getScaffold(name).then(function(item){
    if (!item) return;

    return fs.unlink(item.path);
  }).nodeify(callback);
};

module.exports = Scaffold;