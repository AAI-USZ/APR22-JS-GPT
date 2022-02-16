var extend = require('../extend'),
  route = require('../route'),
  util = require('../util'),
  file = util.file,
  inherits = require('util').inherits,
  async = require('async'),
  clc = require('cli-color'),
  fs = require('fs'),
  watchTree = require('fs-watch-tree').watchTree,
  _ = require('underscore'),
  publicDir = hexo.public_dir,
  sourceDir = hexo.source_dir,
  cache = {};

var process = function(cache, callback){
  var list = route.list(),
    keys = Object.keys(list),
    generate = require('../generate');

  console.log('Generating.');

  async.parallel([
    function(next){
      fs.exists(publicDir, function(exist){
        if (!exist) return next();
        file.empty(publicDir, keys.concat(cache), next);
      });
    },
    function(next){
      var queue = async.queue(function(key, next){
        list[key](function(err, result){
          if (err) throw new Error('Generate Error: ' + key);

          if (result.readable){
            if (hexo.debug) console.log('Copying %s', clc.bold(result.path));
            file.copy(result.path, publicDir + result.source, next);
          } else {
            if (cache[key] !== result){
              cache[key] = result;
              if (hexo.debug) console.log('Writing %s', clc.bold(publicDir + key));
              file.write(publicDir + key, result, next);
            } else {
              next();
            }
          }
        });
      }, 512);

      queue.push(keys, function(err){
        if (err) throw err;
      });

      queue.drain = callback;
    }
  ]);
};

extend.console.register('generate', 'Generate static files', function(args){
  args = args.join().toLowerCase();

  var ignoreTheme = args.match(/-t|--theme/i) ? true : false,
    watch = args.match(/-w|--watch/i) ? true : false,
    start = new Date(),
    generate = require('../generate');

  console.log('Loading.');
  hexo.emit('generateBefore');

  generate({ignore: ignoreTheme}, function(err, cache){
    process(cache, function(){
      if (watch){
        var processing = false;

        console.log('Hexo is watching file changes. Press Ctrl+C to stop.');
        watchTree(sourceDir, {exclude: ['.DS_Store', 'Thumbs.db']}, function(ev){
          var info = '';

          if (ev.isDirectory()){
            info += 'Folder ';
          } else {
            info += 'File ';
          }

          if (ev.isMkdir()){
            info += 'created: ';
          } else if (ev.isDelete()){
            info += 'deleted: ';
          } else {
            info += 'modified: ';
          }

          info += ev.name;
          console.log(info);

          if (!processing){
            processing = true;
            route.clear();
            generate({ignore: true, watch: true}, function(err, cache){
              process(cache, function(){
                processing = false;
                console.log('Done.');
              });
            });
          }
        });
      } else {
        var finish = new Date(),
          elapsed = (finish.getTime() - start.getTime()) / 1000;
        console.log('Site generated in %ss.', elapsed.toFixed(3));
        hexo.emit('generateAfter');
      }
    });
  });
});