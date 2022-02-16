var _getProperty = function(obj, key){
var keys = key.replace(/\[(\w+)\]/g, '.$1').split('.'),
cursor = obj;
