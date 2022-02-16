




var extname = require('path').extname,
mime = require('connect/utils').mime,
utils = require('connect/utils'),
http = require('http'),
sys = require('sys'),
fs = require('fs');



var cache = {};



var viewCache = {};



exports.clearCache = function(){
viewCache = {};
};



function cacheView(path) {
fs.readFile(path, 'utf8', function(err, data){
if (!err) {
viewCache[path] = data;
}
});
}



function cacheViewSync(path) {
return viewCache[path] = fs.readFileSync(path, 'utf8');
}



function viewRoot(app) {
return app.set('views') || process.cwd() + '/views';
}



exports.watcher = function(interval){
interval = interval === true
? 500
: interval;

function watch(file) {
fs.watchFile(file, { interval: interval }, function(curr, prev){
if (curr.mtime > prev.mtime) {
cacheView(file);
}
});
}

(function traverse(dir){
fs.readdir(dir, function(err, files){
if (err) return;
files.forEach(function(file){
file = dir + '/' + file;
fs.stat(file, function(err, stats){
if (err) {
return;
} else if (stats.isFile()) {
watch(file);
} else if (stats.isDirectory()) {
traverse(file);
}
});
});
});
})(viewRoot(this));
};
