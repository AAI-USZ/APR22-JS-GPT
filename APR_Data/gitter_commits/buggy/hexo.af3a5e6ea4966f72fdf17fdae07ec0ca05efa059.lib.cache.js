var util = require('./util'),
  file = util.file,
  fs = require('graceful-fs'),
  _ = require('underscore'),
  store = {},
  cachePath;

exports.init = function(root, callback){
  cachePath = root + '/.cache';
  fs.exists(cachePath, function(exist){
    if (exist){
      file.read(cachePath, function(err, content){
        if (err) throw new Error('Failed to read file: ' + cachePath);
        try {
          store = JSON.parse(content);
        } catch(e){

        }
        callback();
      });
    }
  });
};

exports.list = function(){
  return store;
}

exports.get = function(key){
  return store[key];
};

exports.set = function(key, val, callback){
  if (!_.isFunction(callback)) callback = function(){};
  store[key] = val;
  file.write(cachePath, JSON.stringify(store), callback);
}