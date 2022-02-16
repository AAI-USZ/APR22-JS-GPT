



var rFilenameEscape = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]/g;
var rContinuesDash = /-{1,}/g;
var rTailDash = /-+$/;

exports.filename = function(str, transform){
var result = exports.diacritic(str.toString())
.replace(rFilenameEscape, '-')
.replace(rContinuesDash, '-')
.replace(rTailDash, '');

