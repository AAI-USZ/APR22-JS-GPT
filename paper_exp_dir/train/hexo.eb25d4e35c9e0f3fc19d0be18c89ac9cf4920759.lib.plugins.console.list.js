var extend = require('../../extend'),
route = require('../../route'),
log = hexo.log,
model = hexo.model;

extend.console.register('list', 'List information', function(args, callback){
var types = ['category', 'page', 'post', 'route', 'tag'],
type = args._[0];

if (types.indexOf(type) == -1){
var help = 'Usage: hexo list <type>\n\n' +
'Type:\n' +
'  ' + types.join(', ') + '\n';

console.log(help);

return callback();
}

log.i('Loading');

require('../../load')(function(err){
if (err) return callback(err);

switch (type){
case 'category':
var Category = model('Category');

if (!Category.length){
log.i('No category found');
return callback();
}

var results = ['Categories:'];

Category.sort({name: 1}).each(function(cat){
results.push('- ' + cat.name + ': ' + cat.path);
});

results.push('TOTAL: ' + Category.length);
log.i(results.join('\n'));

break;


case 'page':
var Page = model('Page');

if (!Page.length){
log.i('No page found');
return callback();
}

