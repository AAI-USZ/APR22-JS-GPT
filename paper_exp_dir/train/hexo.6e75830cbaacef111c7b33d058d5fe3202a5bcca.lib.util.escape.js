



var fs = require('hexo-fs');

var rFilenameEscape = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]/g;
var rContinuesDash = /-{1,}/g;
var rTailDash = /-+$/;

var EOL = require('os').EOL;
var rEOL = new RegExp(EOL, 'g');

exports.filename = function(str, transform){
