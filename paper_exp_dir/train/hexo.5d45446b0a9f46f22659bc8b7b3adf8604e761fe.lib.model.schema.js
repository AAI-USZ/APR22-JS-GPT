var moment = require('moment'),
path = require('path'),
url = require('url');

var Schema = require('warehouse').Schema,
Moment = require('./types/moment');

var isEndWith = function(str, last){
return str[str.length - 1] === last;
};

