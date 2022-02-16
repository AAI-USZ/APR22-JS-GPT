var path = require('path');
var minimist = require('minimist');
var wordwrap = require('wordwrap');



var inst = Argv(process.argv.slice(2));
Object.keys(inst).forEach(function(key) {
Argv[key] =
typeof inst[key] == 'function' ? inst[key].bind(inst) : inst[key];
});

var exports = (module.exports = Argv);
function Argv(processArgs, cwd) {
var self = {};
if (!cwd) cwd = process.cwd();

