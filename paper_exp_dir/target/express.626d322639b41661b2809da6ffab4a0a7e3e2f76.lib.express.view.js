
function watch(file) {
fs.watchFile(file, { interval: interval }, function(curr, prev){
