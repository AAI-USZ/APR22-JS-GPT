var fs = require('graceful-fs'),
async = require('async'),
pathFn = require('path'),
vsprintf = require('sprintf-js').vsprintf;

var i18n = module.exports = function(){
this.store = {};
};

var _getProperty = function(obj, key){
var keys = key.replace(/\[(\w+)\]/g, '.$1').split('.'),
cursor = obj;

for (var i = 0, len = keys.length; i < len; i++){
cursor = cursor[keys[i]];
}

return cursor;
};
