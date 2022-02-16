fs.readFile(path, 'utf8', function(err, data){
if (!err) {
viewCache[path] = data;
