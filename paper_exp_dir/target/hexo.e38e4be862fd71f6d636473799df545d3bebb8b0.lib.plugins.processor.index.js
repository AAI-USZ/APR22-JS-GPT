if (excerptRegex.test(content)){
meta.content = content.replace(excerptRegex, function(match, index){
meta.excerpt = index;
