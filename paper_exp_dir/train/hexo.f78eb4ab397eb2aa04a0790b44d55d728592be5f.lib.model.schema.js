var moment = require('moment'),
path = require('path');

var Schema = require('warehouse').Schema,
Moment = require('./types/moment');

var isEndWith = function(str, last){
return str[str.length - 1] === last;
};

var permalinkGetter = function(){
var url = hexo.config.url;

return url + (isEndWith(url, '/') ? '' : '/') + this.path;
