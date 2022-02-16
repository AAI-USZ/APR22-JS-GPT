var _ = require('lodash'),
os = require('os');

module.exports = function(args, callback){
var versions = _.extend({
hexo: hexo.version,
os: os.type() + ' ' + os.release() + ' ' + os.platform() + ' ' + os.arch()
}, process.versions);

if (args.json){
