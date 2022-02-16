var fs = require('graceful-fs');
var intersect = require('intersect');


function isComponent(file, callback) {
fs.readFile(file, function(err, contents) {
var json;
var keys;
var common;


if (err) {
return callback(false);
}

try {
json = JSON.parse(contents.toString());
} catch (err) {
return callback(false);
}





keys = Object.keys(json);
common = intersect(keys, [
'repo',
'development',
'local',
'remotes',
'paths',
'demo'
]);


callback(common.length ? true : false);
});
}

module.exports = isComponent;
