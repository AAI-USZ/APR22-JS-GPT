var extend = require('../../extend'),
route = require('../../route'),
log = hexo.log;

extend.console.register('routes', 'Display all routes', function(args, callback){
log.i('Loading');

require('../../load')(function(err){
if (err) return callback(err);

var list = Object.keys(route.list()).sort(),
