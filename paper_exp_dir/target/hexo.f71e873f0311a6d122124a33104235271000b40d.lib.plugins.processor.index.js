extend.processor.register(/^_posts\/?(.*)\/(.+)\.(\w+)/, function(file, callback){
category = file.params[1],
filename = file.params[2],
