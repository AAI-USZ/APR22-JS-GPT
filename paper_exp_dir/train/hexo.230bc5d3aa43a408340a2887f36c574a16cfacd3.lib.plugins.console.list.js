var extend = require('../../extend'),
route = require('../../route'),
log = hexo.log,
model = hexo.model;

extend.console.register('list', 'List information', function(args, callback){
var types = ['category', 'draft', 'page', 'post', 'route', 'tag'],
type = args._[0];

if (types.indexOf(type) == -1){
var help = 'Usage: hexo list <type>\n\n' +
'Type:\n' +
