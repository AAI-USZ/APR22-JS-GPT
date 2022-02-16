var async = require('async'),
  pathFn = require('path'),
  fs = require('graceful-fs'),
  _ = require('lodash'),
  util = require('../util'),
  file = util.file2,
  yfm = util.yfm;

var cache = {};

var getExtname = function(str){
  return pathFn.extname(str).replace(/^\./, '');
};

/**
 * Check whether the given `path` can be rendered.
 *
 * @param {String} str
 * @return {Boolean}
 * @api public
 */

var isRenderable = exports.isRenderable = function(path){
  return hexo.extend.renderer.isRenderable(path);
};

/**
 * Check whether the given `path` can be rendered synchronously.
 *
 * @param {String} str
 * @return {Boolean}
 * @api public
 */

var isRenderableSync = exports.isRenderableSync = function(path){
  return hexo.extend.renderer.isRenderableSync(path);
};

/**
 * Returns output extension name.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

var getOutput = exports.getOutput = function(path){
  return hexo.extend.renderer.getOutput(path);
};

/**
 * Renders data.
 * Either `data.text` or `data.path` have to be provided.
 *
 * Data properties:
 *
 *   - `text`: File content
 *   - `path`: File source
 *
 * @param {Object} data
 * @param {Object} [options]
 * @param {Function} [callback]
 * @api public
 */

var render = exports.render = function(data, options, callback){
  if (!callback){
    if (typeof options === 'function'){
      callback = options;
      options = {};
    } else {
      callback = function(){};
    }
  }

  async.waterfall([
    function(next){
      if (data.text != null) return next(null, data.text);
      if (!data.path) return next(new Error('No input file or string'));

      file.readFile(data.path, next);
    },
    function(text, next){
      var ext = data.engine || getExtname(data.path);

      if (ext && isRenderable(ext)){
        var renderer = hexo.extend.renderer.get(ext);

        renderer({
          path: data.path,
          text: text
        }, options, next);
      } else {
        next(null, text);
      }
    }
  ], callback);
};

/**
 * Renders data synchronously.
 * Either `data.text` or `data.path` have to be provided.
 *
 * Data properties:
 *
 *   - `text`: File content
 *   - `path`: File source
 *
 * @param {Object} data
 * @param {Object} [options]
 * @return {String}
 */

exports.renderSync = function(data, options){
  if (data.text != null){
    var text = data.text;
  } else if (data.path){
    var text = file.readFileSync(data.path);
    if (!text) return;
  } else {
    return;
  }

  var ext = data.engine || getExtname(data.path);

  if (ext && isRenderableSync(ext)){
    var renderer = hexo.extend.renderer.get(ext, true);

    return renderer({path: data.path, text: text}, options);
  } else {
    return text;
  }
};

/**
 * Renders data with helpers and layout support.
 *
 * Options:
 *
 *   - `layout`: Layout
 *   - `cache`: Enables cache
 *   - `view_dir`: View directory
 *
 * @param {String} source
 * @param {Object} [options]
 * @param {Function} [callback]
 * @api public
 */

var renderFile = exports.renderFile = function(source, options, callback){
  if (!callback){
    if (typeof options === 'function'){
      callback = options;
      options = {};
    } else {
      callback = function(){};
    }
  }

  var helper = hexo.extend.helper.list();

  async.waterfall([
    // Load cache
    function(next){
      if (options.cache && cache.hasOwnProperty(source)){
        next(null, cache[source]);
      } else {
        file.readFile(source, function(err, content){
          if (err) return callback(err);

          var data = cache[source] = yfm(content);
          next(null, data);
        });
      }
    },
    // Render template
    function(data, next){
      var layout = data.hasOwnProperty('layout') ? data.layout : options.layout,
        locals = _.extend({}, helper, options, _.omit(data, 'layout', '_content')),
        extname = pathFn.extname(source),
        renderer = hexo.extend.renderer.get(extname);

      renderer({path: source, text: data._content}, locals, function(err, result){
        if (err) return callback(err);
        if (!layout) return callback(null, result);

        // Relative path
        var layoutPath = pathFn.resolve(source, layout);
        if (!pathFn.extname(layoutPath)) layoutPath += extname;

        var layoutLocals = _.extend({}, locals, {body: result, layout: false});

        fs.exists(layoutPath, function(exist){
          if (exist) return next(null, layoutPath, layoutLocals);

          var viewDir = options.view_dir || options.settings.views;

          if (!exist && !viewDir) return callback(null, result);

          // Absolute path
          var layoutPath = pathFn.join(viewDir, layout);
          if (!pathFn.extname(layoutPath)) layoutPath += extname;

          fs.exists(layoutPath, function(exist){
            if (exist){
              next(null, layoutPath, layoutLocals);
            } else {
              callback(null, result);
            }
          })
        });
      });
    },
    // Wrap the template with layout
    function(layoutPath, locals, next){
      renderFile(layoutPath, locals, callback);
    }
  ]);
};