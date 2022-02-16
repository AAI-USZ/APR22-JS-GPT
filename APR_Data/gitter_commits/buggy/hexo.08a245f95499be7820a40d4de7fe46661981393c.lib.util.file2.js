var fs = require('graceful-fs'),
  pathFn = require('path'),
  async = require('async'),
  _ = require('lodash'),
  EOL = require('os').EOL,
  EOLre = new RegExp(EOL, 'g');

if (!fs.exists || !fs.existsSync){
  fs.exists = pathFn.exists;
  fs.existsSync = pathFn.existsSync;
}

var join = function(parent, child){
  return parent + '/' + child;
};

var mkdirs = exports.mkdirs = function(path, callback){
  var parent = pathFn.dirname(path);

  fs.exists(parent, function(exist){
    if (exist){
      fs.mkdir(path, callback);
    } else {
      mkdirs(parent, function(){
        fs.mkdir(path, callback);
      });
    }
  });
};

var checkParent = function(path, callback){
  var parent = pathFn.dirname(path);

  fs.exists(parent, function(exist){
    if (exist) return callback();

    mkdirs(parent, function(err){
      if (err && err.code === 'EEXIST') return callback();

      callback(err);
    });
  });
};

var writeFile = exports.writeFile = function(path, data, options, callback){
  if (_.isFunction(options)){
    callback = options;
    options = {};
  }

  options = _.extend({
    checkParent: true
  }, options);

  async.series([
    // Check parent folder existance
    function(next){
      if (!options.checkParent) return next();

      checkParent(path, next);
    }
  ], function(err){
    if (err) return callback(err);

    fs.writeFile(path, data, options, callback);
  });
};

var copyFile = exports.copyFile = function(src, dest, options, callback){
  if (_.isFunction(options)){
    callback = options;
    options = {};
  }

  options = _.extend({
    checkParent: true
  }, options);

  async.series([
    // Check parent folder existance
    function(next){
      if (!options.checkParent) return next();

      checkParent(dest, next);
    }
  ], function(err){
    if (err) return callback(err);

    var rs = fs.createReadStream(src),
      ws = fs.createWriteStream(dest);

    rs.pipe(ws)
      .on('error', function(err){
        if (err) callback(err);
      });

    ws.on('close', callback)
      .on('error', function(err){
        if (err) callback(err);
      });
  });
};

var copyDir = exports.copyDir = function(src, dest, options, callback){
  if (_.isFunction(options)){
    callback = options;
    options = {};
  }

  options = _.extend({
    ignoreHidden: true,
    ignorePattern: null
  }, options);

  async.series([
    // Create parent folder
    function(next){
      fs.exists(dest, function(exist){
        if (exist) return next();

        mkdirs(dest, next);
      });
    }
  ], function(err){
    if (err) return callback(err);

    fs.readdir(src, function(err, files){
      if (err) return callback(err);

      async.forEach(files, function(item, next){
        if (options.ignoreHidden && item.substring(0, 1) === '.') return next();
        if (options.ignorePattern && options.ignorePattern.test(item)) return next();

        var childSrc = join(src, item),
          childDest = join(dest, item);

        fs.stat(childSrc, function(err, stats){
          if (err) return callback(err);

          if (stats.isDirectory()){
            copyDir(childSrc, childDest, options, next);
          } else {
            copyFile(childSrc, childDest, {checkParent: false}, next);
          }
        });
      }, callback);
    });
  });
};

var list = exports.list = function(path, options, callback){
  if (_.isFunction(options)){
    callback = options;
    options = {};
  }

  options = _.extend({
    ignoreHidden: true,
    ignorePattern: null
  }, options);

  var parent = options._parent;

  fs.readdir(path, function(err, files){
    if (err) return callback(err);

    var arr = [];

    async.forEach(files, function(item, next){
      if (options.ignoreHidden && item.substring(0, 1) === '.') return next();
      if (options.ignorePattern && options.ignorePattern.test(item)) return next();

      var childPath = join(path, item);

      fs.stat(childPath, function(err, stats){
        if (err) return callback(err);

        if (stats.isDirectory()){
          var childOptions = _.extend({}, options, {
            _parent: parent ? join(parent, item) : item
          });

          list(childPath, childOptions, function(err, files){
            if (err) return callback(err);

            arr = arr.concat(files);

            next();
          });
        } else {
          if (parent){
            arr.push(join(parent, item));
          } else {
            arr.push(item);
          }

          next();
        }
      });
    }, function(err){
      callback(err, arr);
    });
  });
};

var escape = function(str){
  // Transform EOL
  var str = EOL === '\n' ? str : str.replace(EOLre, '\n');

  // Remove UTF BOM
  str = str.replace(/^\uFEFF/, '');

  return str;
};

var readFile = exports.readFile = function(path, options, callback){
  if (_.isFunction(options)){
    callback = options;
    options = {};
  }

  options = _.defaults(options, {
    escape: true,
    encoding: 'utf8'
  });

  fs.readFile(path, options.encoding, function(err, content){
    if (err) return callback(err);

    if (options.escape) content = escape(content);

    callback(null, content);
  });
};

var readFileSync = exports.readFileSync = function(path, options){
  if (!options) options = {};

  options = _.defaults(options, {
    escape: true,
    encoding: 'utf8'
  });

  var content = fs.readFileSync(path, options.encoding);
  if (options.escape) content = escape(content);

  return content;
};

var emptyDir = exports.emptyDir = function(path, options, callback){
  if (_.isFunction(options)){
    callback = options;
    options = {};
  }

  options = _.defaults(options, {
    ignoreHidden: true,
    ignorePattern: null,
    exclude: []
  });

  var exclude = [],
    childExclude = {};

  options.exclude.forEach(function(item){
    var split = item.split('/'),
      front = split.shift();

    exclude.push(front);

    if (!childExclude[front]) childExclude[front] = [];
    if (split.length) childExclude[front].push(join.apply(null, split));
  });

  fs.readdir(path, function(err, files){
    if (err) return callback(err);

    async.forEach(files, function(item, next){
      if (options.ignoreHidden && item.substring(0, 1) === '.') return next();
      if (exclude.indexOf(item) > -1) return next();

      var childPath = join(path, item);

      fs.stat(childPath, function(err, stats){
        if (err) return callback(err);

        if (stats.isDirectory()){
          var childOptions = _.clone(options);
          options.exclude = childExclude[item];

          emptyDir(childPath, options, function(){
            fs.readdir(childPath, function(err, files){
              if (err) return callback(err);
              if (files.length) return next();

              fs.rmdir(childPath, next);
            });
          });
        } else {
          fs.unlink(childPath, next);
        }
      });
    }, callback);
  });
};

var rmdir = exports.rmdir = function(path, callback){
  if (!_.isFunction(callback)) callback = function(){};

  fs.readdir(path, function(err, files){
    if (err) return callback(err);

    async.forEach(files, function(item, next){
      var childPath = join(path, item);

      fs.stat(childPath, function(err, stats){
        if (err) return callback(err);

        if (stats.isDirectory()){
          rmdir(childPath, next);
        } else {
          fs.unlink(childPath, next);
        }
      });
    }, function(){
      fs.rmdir(path, callback);
    })
  });
};