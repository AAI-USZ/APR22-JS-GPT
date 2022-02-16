posix.cat(path).addCallback(function(content){
render(cache[view] = content)
}).addErrback(function(e){
