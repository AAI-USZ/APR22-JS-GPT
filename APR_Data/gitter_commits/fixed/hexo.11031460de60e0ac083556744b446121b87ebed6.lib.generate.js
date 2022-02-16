var generator = require('./extend').generator.list(),
  article = require('./article'),
  theme = require('./theme'),
  util = require('./util'),
  log = util.log,
  file = util.file,
  async = require('async'),
  fs = require('fs'),
  path = require('path'),
  rimraf = require('rimraf'),
  _ = require('underscore');

var site = {
  time: new Date(),
  posts: new Posts(),
  pages: new Posts(),
  categories: {},
  tags: {}
};

function Posts(arr){
  if (arr){
    var length = this.length = arr.length;

    for (var i=0; i<length; i++){
      this[i] = arr[i];
    }
  } else {
    this.length = 0;
  }

  this.each = this.forEach = function(callback){
    for (var i=0, len=this.length; i<len; i++){
      var _callback = callback(this[i], i);

      if (typeof _callback !== 'undefined'){
        if (_callback){
          continue;
        } else {
          break;
        }
      }
    }
  };

  this.toArray = function(){
    var result = [];

    this.each(function(item){
      result.push(item);
    });

    return result;
  };

  this.slice = function(start, end){
    return new Posts([].slice.apply(this.toArray(), arguments));
  };

  this.skip = function(num){
    return this.slice(num);
  };

  this.limit = function(num){
    return this.slice(0, num);
  };

  this.push = function(item){
    this[this.length] = item;
    this.length++;
  };

  this.sort = function(field, order){
    var arr = this.toArray().sort(function(a, b){
      return a[field] - b[field];
    });

    if (typeof order !== 'undefined' && (order === -1 || order.toLowerCase() === 'desc')){
      arr = arr.reverse();
    };

    return new Posts(arr);
  };

  this.random = function(){
    var arr = this.toArray().sort(function(a, b){
      return Math.random() - 0.5 < 0;
    });

    return new Posts(arr);
  }
};

module.exports = function(){
  var start = new Date();

  async.series([
    // Delete previous generated file
    function(next){
      var publicDir = hexo.public_dir;

      fs.exists(publicDir, function(exist){
        if (exist){
          rimraf(publicDir, function(err){
            if (err) throw err;
            log.info('Previous generated file deleted.');
            next(null);
          });
        } else {
          next(null);
        }
      })
    },
    // Read source file
    function(next){
      var source = hexo.source_dir;

      file.dir(source, function(files){
        async.forEach(files, function(item, next){
          var extname = path.extname(item),
            filename = path.basename(item, extname),
            dirs = path.dirname(item).split('/');

          switch (extname){
            case '.md':
            case '.markdown':
            case '.mdown':
            case '.markdn':
            case '.mkd':
            case '.mkdn':
            case '.mdwn':
            case '.mdtxt':
            case '.mdtext':
              if (dirs[0] === '_posts'){
                var category = dirs.slice(1).join('/');
                article.loadPost(source + item, category, function(locals){
                  site.posts.push(locals);
                  next(null);
                });
              } else {
                if (item.substring(0, 1) === '_'){
                  next(null);
                } else {
                  article.loadPage(source + item, item, function(locals){
                    site.pages.push(locals);
                    next(null);
                  });
                }
              }

              break;

            default:
              if (item.substring(0, 1) === '_'){
                next(null);
              } else {
                file.copy(source + item, hexo.public_dir + item);
                next(null);
              }

              break;
          }
        }, function(){
          log.info('Source file loaded.');
          next(null);
        });
      });
    },
    // Analyze categories & tags
    function(next){
      site.posts = site.posts.sort('date', -1);
      site.pages = site.pages.sort('date', -1);

      site.posts.each(function(item){
        if (item.categories){
          _.each(item.categories, function(cat){
            if (site.categories.hasOwnProperty(cat.name)){
              site.categories[cat.name].push(item);
            } else {
              var newCat = new Posts();
              newCat.permalink = cat.permalink;
              newCat.push(item);
              site.categories[cat.name] = newCat;
            }
          });
        }
        
        if (item.tags){
          _.each(item.tags, function(tag){
            if (site.tags.hasOwnProperty(tag.name)){
              site.tags[tag.name].push(item);
            } else {
              var newTag = new Posts();
              newTag.permalink = tag.permalink;
              newTag.push(item);
              site.tags[tag.name] = newTag;
            }
          });
        }
      });

      log.info('Source file analyzed.');
      next(null);
    },
    function(next){
      theme.assets(function(){
        log.info('Theme installed.');
        next(null);
      });
    }
  ], function(){
    async.forEach(generator, function(item, next){
      item(site, function(layout, locals, callback){
        var newLocals = {
          page: locals,
          site: site,
          config: hexo.config,
          theme: theme.config
        };

        theme.render(layout, newLocals, callback);
      }, next);
    }, function(){
      var finish = new Date();
      log.success('Site generated in %d ms', finish.getTime() - start.getTime());
    });
  });
};