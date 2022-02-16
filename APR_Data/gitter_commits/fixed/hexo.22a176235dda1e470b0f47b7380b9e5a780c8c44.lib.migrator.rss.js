var extend = require('../extend'),
  feedparser = require('feedparser'),
  moment = require('moment'),
  async = require('async'),
  _ = require('underscore');

extend.migrator.register('rss', function(args){
  var file = hexo.util.file,
    source = args.shift(),
    target = args.length ? args.shift() : hexo.source_dir + '_posts/',
    start = new Date();

  if (!source){
    console.log('\nUsage: hexo migrate rss <source> [target]\n\nMore info: http://zespia.tw/hexo/docs/migrate.html\n');
  } else {
    async.waterfall([
      function(next){
        console.log('Fetching %s.', source);

        if (source.match(/^https?:\/\//)){
          feedparser.parseUrl(source, next);
        } else {
          feedparser.parseFile(source, next);
        }
      },
      function(meta, posts, next){
        console.log('Analyzing.');

        async.forEach(posts, function(item, next){
          var linkArr = (item.origlink ? item.origlink : item.link).split('/').reverse();

          for (var i=0, len=linkArr.length; i<len; i++){
            if (linkArr[i]){
              var postLink = linkArr[i];
              break;
            }
          }

          if (item.categories){
            if (_.isArray(item.categories)){
              var tags = '\n- ' + item.categories.join('\n- ');
            } else {
              var tags = item.categories.toString();
            }
          }

          var content = [
            '---',
            'layout: post',
            'title: ' + item.title,
            'date: ' + moment(item.pubdate).format('YYYY-MM-DD HH:mm:ss'),
            'comments: true',
            tags ? 'tags: ' + tags : '',
            '---',
          ];

          file.write(target + postLink + '.md', content.join('\n') + '\n\n' + item.description, next);
        }, function(){
          next(null, posts.length);
        });
      }
    ], function(err, length){
      if (err) throw err;

      var end = new Date();
      console.log('%d posts migrated in %d ms.', length, end.getTime() - start.getTime());
    });
  }
});