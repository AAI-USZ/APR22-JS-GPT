




exports.isAbsolute = function(path){
if ('/' == path[0]) return true;
if (':' == path[1] && '\\' == path[2]) return true;
};



exports.union = function(a, b){
if (a && b) {
var keys = Object.keys(b)
