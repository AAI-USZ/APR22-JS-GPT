

var moment = require('moment'),
config = hexo.config;



if (config.language) moment.lang(config.language);



var genUrl = function(str){
