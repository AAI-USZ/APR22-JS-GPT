exports.strip_html = function(content){
return content.toString().replace(/<[^>]*>/g, '');
};
