var createWinGlob = function(realGlob) {
return function(pattern, options, done) {
var drive = pattern.substr(0, 3);
