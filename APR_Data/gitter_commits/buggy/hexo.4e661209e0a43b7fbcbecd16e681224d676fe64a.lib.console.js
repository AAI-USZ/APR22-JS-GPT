var async = require('async'),
  colors = require('colors'),
  _ = require('underscore');

module.exports = function(command, argv){
  async.series([
    function(next){
      require('./config')(process.cwd(), argv, next);
    },
    function(next){
      if (argv.safe) next();
      else require('./loader')(next);
    }
  ], function(){
    var list = require('./extend').console.list(),
      init = Object.keys(hexo.config).length ? false : true,
      debug = hexo.debug;

    _.each(list, function(val, key){
      var options = val.options;
      if ((init && !options.init) || (!debug && options.debug)){
        delete list[key];
      }
    });


    var keys = Object.keys(list);

    if (keys.indexOf(command) === -1){
      var maxLen = 0,
        result = '\nUsage: hexo <command>\n\nCommands:\n';

      var helps = [
        ['help', 'Display help']
      ];

      _.each(list, function(val, key){
        helps.push([key, val.description]);
      });

      helps = helps.sort(function(a, b){
        var orderA = a[0],
          orderB = b[0];

        if (orderA.length >= orderB.length && maxLen < orderA.length) maxLen = orderA.length;
        else if (maxLen < orderB.length) maxLen = orderB.length;

        if (orderA < orderB) return -1;
        else if (orderA > orderB) return 1;
        else return 0;
      });

      helps.forEach(function(item){
        result += '  ' + item[0].bold;

        for (var i=0; i<maxLen + 3 - item[0].length; i++){
          result += ' ';
        }

        result += item[1] + '\n';
      });

      result += '\nMore info: http://zespia.tw/hexo/docs/cli.html\n';

      console.log(result);
    } else {
      hexo.emit('ready');
      list[command](argv);
    }
  });
};