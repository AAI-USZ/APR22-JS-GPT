var fs = require('fs'),
  async = require('async'),
  sep = require('path').sep,
  yaml = require('yamljs'),
  i18n = require('./i18n'),
  util = require('./util'),
  file = util.file;

module.exports = function(root, callback){
  async.parallel([
    function(next){
      file.read(__dirname + '/../package.json', next);
    },
    function(next){
      fs.exists(root + '/_config.yml', function(exist){
        if (exist){
          file.read(root + '/_config.yml', next);
        } else {
          next(null, '');
        }
      });
    }
  ], function(err, result){
    if (err) throw err;

    var version = JSON.parse(result[0]).version,
      config = yaml.parse(result[1]),
      env = process.env,
      themeDir = config ? root + sep + 'themes' + sep + config.theme + sep : null;

    global.hexo = {
      get base_dir(){return root + sep},
      get public_dir(){return root + sep + 'public' + sep},
      get source_dir(){return root + sep + 'source' + sep},
      get theme_dir(){return themeDir},
      get plugin_dir(){return root + sep + 'node_modules' + sep},
      get version(){return version},
      get env(){return env},
      get config(){return config},
      get extend(){return require('./extend')},
      get util(){return require('./util')},
      get render(){return require('./render')},
      get i18n(){return i18n.i18n},
      get route(){return require('./route')}
    };

    if (config){
      require('./renderer');
      require('./tag');
      require('./deployer');
      require('./processor');
      require('./helper');
      require('./generator');
    }

    //i18n.core.load(__dirname + '/../languages', callback);
    callback();
  });
};