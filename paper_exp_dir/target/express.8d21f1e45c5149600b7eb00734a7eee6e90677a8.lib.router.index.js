callbacks.forEach(function(fn, i){
var type = {}.toString.call(fn);
var msg = '.' + method + '() requires callback functions but got a ' + type;
