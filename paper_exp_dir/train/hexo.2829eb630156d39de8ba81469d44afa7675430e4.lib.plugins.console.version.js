var _ = require('lodash');

module.exports = function(args, callback){
var versions = _.extend({hexo: hexo.version}, process.versions);

if (args.json){
console.log(versions);
} else {
var result = [];

