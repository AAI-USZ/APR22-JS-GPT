
/*!
 * Express - View
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var extname = require('path').extname,
    mime = require('connect/utils').mime,
    utils = require('connect/utils'),
    http = require('http'),
    sys = require('sys'),
    fs = require('fs');

/**
 * Cache supported template engine exports to
 * increase performance by lowering the number
 * of calls to `require()`.
 * 
 * @type Object
 */

var cache = {};

/**
 * Cache view contents to prevent I/O hits.
 *
 * @type Object
 */

var viewCache = {};

/**
 * Clear the view cache.
 *
 * @api public
 */

exports.clearCache = function(){
    viewCache = {};
};

/**
 * Cache view at the given `path`.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

function cacheView(path) {
    fs.readFile(path, 'utf8', function(err, data){
        if (!err) {
            viewCache[path] = data;
        }
    });
}

/**
 * Synchronously cache view at the given `path`.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

function cacheViewSync(path) {
    return viewCache[path] = fs.readFileSync(path, 'utf8');
}

/**
 * Return view root path for the given `app`.
 *
 * @param {express.Server} app
 * @return {String}
 * @api private
 */

function viewRoot(app) {
    return app.set('views') || process.cwd() + '/views';
}

/**
 * Setup view reloading, checking at the given `interval`
 * which defaults to 5 minutes.
 *
 * @param {Numbers} interval
 * @api private
 */

exports.watcher = function(interval){
    interval = interval === true
        ? 300000
        : interval;
    (function cache(dir){
        fs.readdir(dir, function(err, files){
            if (!err) {
                files.forEach(function(file){
                    file = dir + '/' + file;
                    fs.stat(file, function(err, stats){
                        if (!err) {
                            if (stats.isFile()) {
                                fs.watchFile(file, { interval: interval }, function(curr, prev){
                                    if (curr.mtime > prev.mtime) {
                                        cacheView(file);
                                    }
                                });
                            } else if (stats.isDirectory()) {
                                cache(file);
                            }
                        }
                    });
                });
            }
        });
    })(viewRoot(this));
};

/**
 * Render `view` partial with the given `options`.
 *
 * Options:
 *   - `object` Single object with name derived from the view (unless `as` is present) 
 *
 *   - `as` Variable name for each `collection` value, defaults to the view name.
 *     * as: 'something' will add the `something` local variable
 *     * as: this will use the collection value as the template context
 *     * as: global will merge the collection value's properties with `locals`
 *
 *   - `collection` Array of objects, the name is derived from the view name itself. 
 *     For example _video.html_ will have a object _video_ available to it.
 *
 * @param  {String} view
 * @param  {Object|Array} options or collection
 * @return {String}
 * @api public
 */

http.ServerResponse.prototype.partial = function(view, options, ext){
    // Inherit parent view extension when not present
    if (ext && view.indexOf('.') < 0) {
        view += ext;
    }

    // Allow collection to be passed as second param
    if (Array.isArray(options)) {
        options = { collection: options };
    }

    // Defaults
    options = options || {};
    options.locals = options.locals || {};
    options.partial = true;
    options.layout = false;

    // Collection support
    var collection = options.collection;
    if (collection) {
        var name = options.as || view.split('.')[0],
            len = collection.length;
        delete options.collection;
        options.locals.collectionLength = len;
        return collection.map(function(val, i){
            options.locals.firstInCollection = i === 0;
            options.locals.indexInCollection = i;
            options.locals.lastInCollection = i === len - 1;
            options.object = val;
            return this.partial(view, options);
        }, this).join('');
    } else {
        if (options.object) {
            var name = options.as || view.split('.')[0];
            if (typeof name === 'string') {
                options.locals[name] = options.object;
            } else if (name === global) {
                utils.merge(options.locals, options.object);
            } else {
                options.context = options.object;
            }
        }
        return this.render(view, options);
    }
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, however otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *  
 *  Most engines accept one or more of the following options,
 *  both _haml_ and _jade_ accept all:
 *
 *  - `context|scope`   Template evaluation context (`this`)
 *  - `locals`    Object containing local variables
 *  - `filename`  Filename used for the `cache` option
 *  - `cache`     Cache intermediate JavaScript in memory
 *  - `debug`     Output debugging information
 *
 * @param  {String} view
 * @param  {Object} options
 * @param  {Function} fn
 * @api public
 */

http.ServerResponse.prototype.render = function(view, options, fn){
    options = options || {};
    var defaultEngine = this.app.set('view engine');

    // Support "view engine" setting
    if (view.indexOf('.') < 0 && defaultEngine) {
        view += '.' + defaultEngine;
    }

    // Defaults
    var self = this,
        helpers = this.app.viewHelpers,
        dynamicHelpers = this.app.dynamicViewHelpers,
        root = viewRoot(this.app),
        ext = extname(view),
        partial = options.partial,
        layout = options.layout === undefined ? true : options.layout,
        layout = layout === true
            ? 'layout' + ext
            : layout;

    // Allow layout name without extension
    if (typeof layout === 'string' && layout.indexOf('.') < 0) {
        layout += ext;
    }

    // Normalize "context" to "scope", defaulting to this response
    options.scope = options.scope || options.context || this;

    // Auto-cache in production
    if (this.app.set('env') === 'production') {
        options.cache = true;
    }

    // Partials support
    if (options.partial) {
        root += '/partials';
    }

    // View path
    var path = view[0] === '/'
        ? view
        : root + '/' + view;

    // Pass filename to the engine and view
    options.locals = options.locals || {};
    options.locals.__filename = options.filename = path;

    // Dynamic helper support
    var keys = Object.keys(dynamicHelpers);
    for (var i = 0, len = keys.length; i < len; ++i) {
        var key = keys[i],
            val = dynamicHelpers[key];
        if (typeof val === 'function') {
            helpers[key] = val.call(this.app, this.req, this, this.req.params.path);
        }
    }

    // Always expose partial() as a local
    options.locals.partial = function(view, options){
        return self.partial.call(self, view, options, ext);
    };
    
    // Merge view helpers
    options.locals.__proto__ = helpers;

    function error(err) {
        if (fn) {
            fn(err);
        } else {
            self.req.next(err);
        }
    }

    // Cache contents
    try {
        var str = viewCache[path] || cacheViewSync(path);
    } catch (err) {
        return error(err);
    }

    // Cache template engine exports
    var engine = cache[ext] || (cache[ext] = require(ext.substr(1)));

    // Attempt render
    try {
        var str = engine.render(str, options);
    } catch (err) {
        return error(err);
    }

    // Layout support
    if (layout) {
        options.layout = false;
        options.locals.body = str;
        self.render(layout, options);
    } else if (partial) {
        return str;
    } else if (fn) {
        fn(null, str);
    } else {
        self.send(str);
    }
};
