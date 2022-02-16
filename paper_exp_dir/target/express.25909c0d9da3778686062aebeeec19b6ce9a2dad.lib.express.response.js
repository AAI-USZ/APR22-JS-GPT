http.ServerResponse.prototype.sendfile = function(path, fn){
fs.readFile(path, function(err, buf){
self.contentType(path);
