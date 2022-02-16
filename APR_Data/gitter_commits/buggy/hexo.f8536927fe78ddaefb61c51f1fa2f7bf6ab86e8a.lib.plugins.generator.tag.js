var extend = require('../../extend'),
  route = require('../../route'),
  paginator = require('./paginator');

extend.generator.register(function(locals, render, callback){
  var config = hexo.config.tag;

  if (!config) return callback();

  locals.tags.each(function(tag){
    var posts = tag.posts.sort('date', -1),
      arr = posts.toArray(),
      latest = true;

    for (var i=0, len=arr.length; i<len; i++){
      if (!arr[i]._latest){
        latest = false;
        break;
      }
    }

    if (!latest || hexo.cache.rebuild){
      var path = tag.path;
      posts.tag = tag.name;

      if (config == 2){
        paginator(path, posts, 'tag', render);
      } else {
        route.set(path, function(fn){
          var result = render('tag', posts);
          if (!result) result = render('archive', posts);
          if (!result) result = render('index', posts);

          fn(null, result);
        });
      }
    }
  });

  callback();
});