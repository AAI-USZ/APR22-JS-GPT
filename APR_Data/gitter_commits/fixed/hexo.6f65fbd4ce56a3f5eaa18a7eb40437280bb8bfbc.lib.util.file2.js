/**
 * Module dependencies.
 */

var fs = require('graceful-fs'),
  pathFn = require('path'),
  async = require('async'),
  _ = require('lodash'),
  EOL = require('os').EOL,
  EOLre = new RegExp(EOL, 'g');

/**
 * Fallback for Node.js 0.8 or below.
 */

if (!fs.exists || !fs.existsSync){
  fs.exists = pathFn.exists;
  fs.existsSync = pathFn.existsSync;
}

/**
 * Joins the given `parent` and `child` into a normal file path.
 *
 * @param {String} parent
 * @param {String} child
 * @return {String}
 * @api private
 */

var join = function(parent, child){
  return parent ? pathFn.join(parent, child) : child;
};

/**
 * Creates the directory in the given `path`, including any necessary but
 * nonexistent parent directories.
 *
 * @param {String} path
 * @param {Function} callback
 * @api public
 */

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

/**
 * Checks whether the parent directories exists. If not, call `mkdirs`.
 *
 * @param {String} path
 * @param {Function} callback
 * @api private
 */

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

/**
 * Writes the `data` to the given `path`.
 *
 * Options:
 *
 *   - `checkParent`: Check the existance of parent directories before writing.
 *
 * @param {String} path
 * @param {String|Buffer} data
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

var writeFile = exports.writeFile = function(path, data, options, callback){
  if (!callback){
    if (typeof options === 'function'){
      callback = options;
      options = {};
    } else {
      callback = function(){};
    }
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

/**
 * Copies the file from `src` to `dest`.
 *
 * Options:
 *
 *   - `checkParent`: Check the existance of parent directories before writing.
 *
 * @param {String} src
 * @param {String} dest
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

var copyFile = exports.copyFile = function(src, dest, options, callback){
  if (!callback){
    if (typeof options === 'function'){
      callback = options;
      options = {};
    } else {
      callback = function(){};
    }
  }

  options = _.extend({
    checkParent: true
  }, options);

  var called = false;

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
        if (err && !called){
          called = true;
          callback(err);
        }
      });

    ws.on('close', callback)
      .on('error', function(err){
        if (err && !called){
          called = true;
          callback(err);
        }
      });
  });
};

/**
 * Copies the directory from `src` to `dest`.
 *
 * Options:
 *
 *   - `ignoreHidden`: Ignore hidden files.
 *   - `ignorePattern`: Ignore any files that match the pattern.
 *
 * @param {String} src
 * @param {String} dest
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

var copyDir = exports.copyDir = function(src, dest, options, callback){
  if (!callback){
    if (typeof options === 'function'){
      callback = options;
      options = {};
    } else {
      callback = function(){};
    }
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
        if (options.ignoreHidden && item[0] === '.') return next();
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

/**
 * Lists all files in the given `path`.
 *
 * Options:
 *
 *   - `ignoreHidden`: Ignore hidden files.
 *   - `ignorePattern`: Ignore any files that match the pattern.
 *
 * @param {String} path
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

var list = exports.list = function(path, options, callback){
  if (!callback){
    if (typeof options === 'function'){
      callback = options;
      options = {};
    } else {
      callback = function(){};
    }
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
      if (options.ignoreHidden && item[0] === '.') return next();
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

/**
 * Converts EOL and removes UTF BOM.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

var escape = function(str){
  // Transform EOL
  var str = EOL === '\n' ? str : str.replace(EOLre, '\n');

  // Remove UTF BOM
  str = str.replace(/^\uFEFF/, '');

  return str;
};

/**
 * Reads a file.
 *
 * Options:
 *
 *   - `escape`: Transform EOL and remove UTF BOM.
 *   - `encoding`: File encoding.
 *
 * @param {String} path
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

var readFile = exports.readFile = function(path, options, callback){
  if (!callback){
    if (typeof options === 'function'){
      callback = options;
      options = {};
    } else {
      callback = function(){};
    }
  }

  options = _.extend({
    escape: true,
    encoding: 'utf8'
  }, options);

  fs.readFile(path, options.encoding, function(err, content){
    if (err) return callback(err);

    if (options.escape && options.encoding) content = escape(content);

    callback(null, content);
  });
};

/**
 * Reads a file synchronously.
 *
 * Options:
 *
 *   - `escape`: Transform EOL and remove UTF BOM.
 *   - `encoding`: File encoding.
 *
 * @param {String} path
 * @param {Object} options
 * @return {String}
 * @api public
 */

var readFileSync = exports.readFileSync = function(path, options){
  if (!options) options = {};

  options = _.extend({
    escape: true,
    encoding: 'utf8'
  }, options);

  var content = fs.readFileSync(path, options.encoding);
  if (options.escape && options.encoding) content = escape(content);

  return content;
};

/**
 * Clears a directory.
 *
 * Options:
 *
 *   - `ignoreHidden`: Ignore hidden files.
 *   - `ignorePattern`: Ignore any files that match the pattern.
 *   - `exclude`: File path to exclude
 *
 * @param {String} path
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

var emptyDir = exports.emptyDir = function(path, options, callback){
  if (!callback){
    if (typeof options === 'function'){
      callback = options;
      options = {};
    } else {
      callback = function(){};
    }
  }

  options = _.extend({
    ignoreHidden: true,
    ignorePattern: null,
    exclude: []
  }, options);

  var parent = options._parent || '',
    arr = [];

  fs.readdir(path, function(err, files){
    if (err) return callback(err);

    async.forEach(files, function(item, next){
      var itemPath = join(parent, item),
        childPath = join(path, item);

      if (options.ignoreHidden && item[0] === '.') return next();
      if (options.ignorePattern && options.ignorePattern.test(itemPath)) return next();
      if (options.exclude && options.exclude.indexOf(itemPath) > -1) return next();

      fs.stat(childPath, function(err, stats){
        if (err) return callback(err);

        if (stats.isDirectory()){
          emptyDir(childPath, _.extend({}, options, {_parent: itemPath}), function(err, removed){
            if (err) return callback(err);

            arr = arr.concat(removed);

            fs.readdir(childPath, function(err, files){
              if (err) return callback(err);
              if (files.length) return next();

              fs.rmdir(childPath, next);
            });
          });
        } else {
          arr.push(itemPath);
          fs.unlink(childPath, next);
        }
      });
    }, function(err){
      callback(err, arr);
    });
  });
};

/**
 * Removes a directory.
 *
 * @param {String} path
 * @param {Function} callback
 * @api public
 */

var rmdir = exports.rmdir = function(path, callback){
  if (typeof callback !== 'function') callback = function(){};

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