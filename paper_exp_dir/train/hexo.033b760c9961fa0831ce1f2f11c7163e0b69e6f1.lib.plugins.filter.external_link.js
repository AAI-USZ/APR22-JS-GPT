var url = require('url'),
cheerio = require('cheerio');

module.exports = function(data, callback){
var config = hexo.config;

if (!config.external_link) return callback();

var $ = cheerio.load(data.content);

$('a').each(function(){
