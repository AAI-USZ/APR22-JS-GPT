



var rFilenameEscape = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]/g,
rContinuesDash = /-{1,}/g,
rTailDash = /-+$/;

var EOL = require('os').EOL,
rEOL = new RegExp(EOL, 'g');

exports.filename = function(str, transform){
var result = exports.diacritic(str.toString())
.replace(rFilenameEscape, '-')
.replace(rContinuesDash, '-')
