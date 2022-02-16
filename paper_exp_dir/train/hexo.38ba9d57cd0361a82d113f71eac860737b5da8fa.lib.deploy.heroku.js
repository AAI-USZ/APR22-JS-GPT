var async = require('async'),
clc = require('cli-color'),
_ = require('underscore'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

var command = function(comm, args, callback){
spawn({
command: comm,
args: args,
exit: function(code){
if (code === 0) callback();
}
});
}

