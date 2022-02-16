var stylus = require('stylus'),
nib = require('nib');

var getProperty = function(obj, key){
key = key.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');

