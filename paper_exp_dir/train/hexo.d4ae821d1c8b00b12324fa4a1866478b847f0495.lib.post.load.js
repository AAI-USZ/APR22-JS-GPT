var _ = require('lodash'),
async = require('async');



module.exports = function(options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

options = _.extend({
watch: false
}, options);

var isReady = false;

async.auto({
process_theme: function(next){
hexo.theme.process(next);
},
watch_theme: ['process_theme', function(next){
if (options.watch){
hexo.theme.watch();

hexo.on('processAfter', function(path){
if (isReady && path === hexo.theme_dir){
hexo.theme.generate(options);
}
});
}

next();
}],
process_source: function(next){
hexo.source.process(next);
},
watch_source: ['process_source', function(next){
if (options.watch){
hexo.source.watch();

hexo.on('processAfter', function(path){
if (isReady && path === hexo.source_dir){
hexo.theme.generate(options);
}
});
}

next();
}]
}, function(err){
if (err) return callback(err);

hexo.theme.generate(options, function(err){
if (err) return callback(err);

isReady = true;
callback();
});
});
};
