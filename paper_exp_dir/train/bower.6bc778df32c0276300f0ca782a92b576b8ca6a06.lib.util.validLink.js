var Q = require('q');
var fs = require('./fs');

function validLink(file) {


return Q.nfcall(fs.lstat, file)
.then(function(lstat) {
if (!lstat.isSymbolicLink()) {
return [false];
}

return Q.nfcall(fs.stat, file).then(function(stat) {
return [stat];
});
})
.fail(function(err) {
return [false, err];
});
}

