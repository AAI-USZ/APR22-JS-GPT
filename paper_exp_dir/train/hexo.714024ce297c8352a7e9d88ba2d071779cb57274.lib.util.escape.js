



var FILE_NAME_ESCAPE_REGEX = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]/g;
var CONTINUES_DASH_REGEX = /-{1,}/g;

exports.filename = function(str, transform){
var result = exports.diacritic(str.toString())
.replace(FILE_NAME_ESCAPE_REGEX, '-')
.replace(CONTINUES_DASH_REGEX, '-');

transform = parseInt(transform, 10);

