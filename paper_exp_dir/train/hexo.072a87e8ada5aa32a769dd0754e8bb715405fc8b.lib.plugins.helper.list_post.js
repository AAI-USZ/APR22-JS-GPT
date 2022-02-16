var _ = require('lodash');

var findData = function(data, source){
if (!source.length) return true;

for (var i = 0, len = source.length; i < len; ++i){
if (data.indexOf(source[i]) != -1) return true;
}

return false;
