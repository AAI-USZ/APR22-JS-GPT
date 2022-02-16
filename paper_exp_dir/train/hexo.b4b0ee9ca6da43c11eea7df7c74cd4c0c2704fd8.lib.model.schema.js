var moment = require('moment'),
path = require('path'),
url = require('url'),
util = require('../util'),
escape = util.escape;

var Schema = require('warehouse').Schema,
Moment = require('./types/moment');

var isEndWith = function(str, last){
return str[str.length - 1] === last;
};
