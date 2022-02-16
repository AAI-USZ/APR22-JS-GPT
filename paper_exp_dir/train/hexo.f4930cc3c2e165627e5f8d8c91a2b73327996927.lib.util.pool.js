var child_process = require('child_process'),
cpus = require('os').cpus().length,
nextTick;

if (setImmediate != null){
nextTick = function(fn){
setImmediate(fn);
};
} else {
nextTick = function(fn){
process.nextTick(fn);
