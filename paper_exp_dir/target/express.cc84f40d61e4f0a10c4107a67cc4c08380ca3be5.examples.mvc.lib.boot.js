fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
verbose && console.log('\n   %s:', name);
var obj = require('./../controllers/' + name)
