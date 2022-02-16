fs.exists(packagePath, function(exist){
if (exist){
var obj = require(packagePath);
