var moment = require('moment'),
path = require('path');

var Schema = require('warehouse').Schema,
Moment = require('./types/moment'),
Serial = require('./types/serial');

var isEndWith = function(str, last){
return str[str.length - 1] === last;
};
