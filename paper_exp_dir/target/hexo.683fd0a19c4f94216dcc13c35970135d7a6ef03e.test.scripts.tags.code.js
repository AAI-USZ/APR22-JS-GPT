var util = require('hexo-util');
function highlight(code, options){
return util.highlight(code, options || {})
