var Q = require('q');
var fs = require('graceful-fs');

function validLink(file) {


return Q.nfcall(fs.lstat, file)
.then(function (lstat) {
if (!lstat.isSymbolicLink()) {
return [false];
}

return Q.nfcall(fs.stat, file)
.then(function (stat) {
return [stat];
});
})
.fail(function (err) {
return [false, err];
});
}

module.exports = validLink;

