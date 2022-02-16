

var child_process = require('child_process'),
cpus = require('os').cpus().length;



if (typeof setImmediate === 'undefined'){
setImmediate = process.nextTick;
}

