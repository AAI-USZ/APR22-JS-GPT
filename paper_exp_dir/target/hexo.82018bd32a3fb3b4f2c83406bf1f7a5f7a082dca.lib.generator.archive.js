if (config.archive == 2){
posts.each(function(item, i){
async.forEach(Object.keys(yearly), function(year, next){
