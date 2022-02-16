var async = require('async'),
  pathFn = require('path'),
  Box = require('../box'),
  util = require('../util'),
  file = util.file2;

var Source = module.exports = function Source(){
  var base = hexo.source_dir;

  Box.call(this, base);

  hexo.on('processAfter', function(path){
    if (path !== base) return;

    _saveDatabase();
  });
};

Source.prototype.__proto__ = Box.prototype;

var _saveDatabase = function(){
  var model = hexo.model;

  var store = {
    Asset: model('Asset')._store.list(),
    Cache: model('Cache')._store.list()
  };

  file.writeFile(pathFn.join(hexo.base_dir, 'db.json'), JSON.stringify(store), function(err){
    if (err){
      hexo.log.e('Cache save failed');
    } else {
      hexo.log.d('Cache saved');
    }
  });
};

Source.prototype.load = Source.prototype.process = function(){
  this.processors = hexo.extend.processor.list();
  Box.prototype.process.apply(this, arguments);
};