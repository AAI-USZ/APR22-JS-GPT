function cacheView(path) {
fs.readFile(path, 'utf8', function(err, data){
if (!err) {
