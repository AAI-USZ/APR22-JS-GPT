var pathFn = require('path'),
  async = require('async'),
  spawn = require('child_process').spawn,
  file = require('../../lib/util/file2');

var compareFile = function(a, b, callback){
  async.parallel([
    function(next){
      file.readFile(a, {encoding: null}, next);
    },
    function(next){
      file.readFile(b, {encoding: null}, next);
    }
  ], function(err, results){
    if (err) return callback(err);

    if (results[0].toString() === results[1].toString()){
      callback();
    } else {
      callback(new Error(a + ' is not equal to ' + b));
    }
  });
};

describe('init', function(){
  it('init', function(done){
    var cmd = spawn('./bin/hexo', ['init', 'test/blog'], {
      cwd: pathFn.join(__dirname, '../..')
    });

    cmd.on('close', function(){
      done();
    });
  });

  it('check contents', function(done){
    var blogDir = pathFn.join(__dirname, '../blog'),
      assetDir = pathFn.join(__dirname, '../../assets');

    async.parallel([
      function(next){
        file.list(blogDir, function(err, files){
          async.each(files, function(file, next){
            compareFile(pathFn.join(blogDir, file), pathFn.join(assetDir, file), next);
          }, next);
        });
      },
      function(next){
        compareFile(pathFn.join(blogDir, '.gitignore'), pathFn.join(assetDir, 'gitignore'), next);
      }
    ], done);
  });

  after(function(done){
    var hexo = require('../../lib/hexo');

    hexo.init({
      cwd: pathFn.join(__dirname, '../blog'),
      silent: true
    }, done);
  });
});