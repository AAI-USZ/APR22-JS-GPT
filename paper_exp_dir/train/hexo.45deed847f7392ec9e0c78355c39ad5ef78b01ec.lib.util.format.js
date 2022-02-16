



exports.stripHtml = function(content){
return content.toString().replace(/<[^>]*>/g, '');
};

exports.strip_html = exports.stripHtml;



exports.trim = function(content){
return content.toString().trim();
};



exports.titlecase = require('inflection').titleize;



exports.wordWrap = function(text, width){
width = width || 80;

var arr = [];

for (var i = 0, length = text.length; i < length; i += width){
arr.push(text.substr(i, width));
}

return arr.join('\n');
};

exports.word_wrap = exports.wordWrap;



