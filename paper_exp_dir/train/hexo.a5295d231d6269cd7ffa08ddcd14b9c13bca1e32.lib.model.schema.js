var moment = require('moment'),
config = hexo.config;

if (config.language) moment.lang(config.language);

var startsWith = function(str, text){
return str.substr(0, 1) === text;
};

var endsWith = function(str, text){
return str.substr(str.length - 1, 1) === text;
