var async = require('async'),
util = require('../util'),
log = util.log,
spawn = util.spawn;

var command = function(command, callback){
spawn(command,
function(data){
log.info(data);
},
function(data){
log.error(data);
},
function(code){
if (code == 0) callback();
else log.error(code);
}
);
};

exports.deploy = function(){

};

exports.setup = function(args){
var repo = args[0];

if (repo === undefined) return false;

if (args[1]){
var branch = args[1];
} else {
if (repo.match(/^(https?:\/\/|git(@|:\/\/))([^\/]+)/)[3].match(/github\.com/)){
var branch = repo.match(/\/\w+\.github\.com/) ? 'master' : 'gh-pages';
} else {
var branch = 'master';
}
}

