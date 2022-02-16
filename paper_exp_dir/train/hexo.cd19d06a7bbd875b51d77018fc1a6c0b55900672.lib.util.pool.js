var child_process = require('child_process'),
cpus = require('os').cpus().length;

if (typeof setImmediate !== 'undefined'){
var nextTick = function(fn){
setImmediate(fn);
};
} else {
var nextTick = function(fn){
process.nextTick(fn);
};
}
