var extend = require('./extend'),
generate = extend.generate.list(),
process = extend.process.list(),
theme = require('./theme'),
Collection = require('./model').Collection,
async = require('async');

var site = {
posts: new Collection(),
pages: new Collection()
};

module.exports = function(){
var start = new Date();

async.forEachSeries(process, function(item, next){
