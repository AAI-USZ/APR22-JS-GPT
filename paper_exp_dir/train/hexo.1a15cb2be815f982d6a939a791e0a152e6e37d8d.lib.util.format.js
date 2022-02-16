

var _ = require('lodash');



exports.strip_html = function(content){
return content.toString().replace(/<[^>]*>/g, '');
};



exports.trim = function(content){
return content.toString().trim();
};
