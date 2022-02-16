var extend = require('./extend'),
generator = extend.generator.list(),
processor = extend.processor.list(),
theme = require('./theme'),
Collection = require('./model').Collection,
async = require('async');

var site = {
posts: new Collection(),
pages: new Collection()
};

module.exports = function(){
var start = new Date();

async.forEachSeries(processor, function(item, next){
item(site, function(err, locals){
if (err) throw err;
if (locals) site = locals;
next();
});
}, function(err){
if (err) throw err;

Object.freeze(site);

async.forEach(generator, function(item, next){
item(site, function(layout, locals, callback){
var newLocals = {
page: locals,
site: site,
config: hexo.config,
theme: theme.config
};

callback(null, theme.render(layout, newLocals));
}, next);
}, function(){
var finish = new Date();
console.log('Site generated in %d ms.', finish.getTime() - start.getTime());
});
});
};
