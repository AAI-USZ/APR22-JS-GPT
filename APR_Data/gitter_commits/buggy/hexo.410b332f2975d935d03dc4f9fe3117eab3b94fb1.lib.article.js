var helper = require('./extend').helper.list(),
  render = require('./render'),
  theme = require('./theme'),
  util = require('./util'),
  file = util.file,
  yfm = util.yfm,
  async = require('async'),
  fs = require('fs'),
  moment = require('moment'),
  path = require('path'),
  swig = require('swig'),
  _ = require('underscore');

swig.init({tags: helper});

var regex = {
  excerpt: /<!--\s*more\s*-->/
};

var load = function(source, callback){
  async.waterfall([
    function(next){
      file.read(source, function(err, result){
        if (err) throw err;
        fs.stat(source, function(err, stats){
          if (err) throw err;
          next(null, result, stats);
        });
      });
    },
    function(file, stats, next){
      var meta = yfm(file);

      meta.date = _.isDate(meta.date) ? moment(meta.date) : moment(meta.date, 'YYYY-MM-DD HH:mm:ss');
      meta.updated = moment(stats.mtime);

      render.render(meta._content, 'md', function(err, result){
        if (err) throw err;

        var result = swig.compile(result)();        
        delete meta._content;

        if (result.match(regex.excerpt)){
          meta.content = result.replace(regex.excerpt, '<span id="more"></span>');
          meta.excerpt = result.split(regex.excerpt)[0];
        } else {
          meta.content = result;
        }

        callback(meta);
      });
    }
  ]);
};

exports.loadPost = function(source, category, callback){
  var config = hexo.config,
    extname = path.extname(source),
    filename = path.basename(source, extname);

  load(source, function(meta){
    if (meta.tags){
      meta.tags = _.map(meta.tags, function(item){
        return {
          name: item,
          permalink: config.root + config.tag_dir + '/' + item
        };
      });
    }

    if (category){
      var categories = category.split(path.sep);

      meta.categories = [];

      for (var i=0, len=categories.length; i<len; i++){
        var item = categories[i];

        meta.categories.push({
          name: item,
          permalink: config.root + categories.slice(0, i + 1).join('/')
        });
      }
    }

    var date = meta.date;

    meta.permalink = config.root + config.permalink
      .replace(/:category/, category ? category : config.category)
      .replace(/:year/, date.format('YYYY'))
      .replace(/:month/, date.format('MM'))
      .replace(/:day/, date.format('DD'))
      .replace(/:title/, filename);

    callback(meta);
  });
};

exports.loadPage = function(source, category, callback){
  var extname = path.extname(source);

  load(source, function(meta){
    meta.permalink = config.root + category.replace(extname, '.html');

    callback(meta);
  });
};