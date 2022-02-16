posix.cat(file, "binary").addCallback(function(content){
request.status(200)
request.response.body = content
