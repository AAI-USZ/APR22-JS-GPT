var fstream = require('fstream');
var fstreamIgnore = require('fstream-ignore');
var fs = require('./fs');
var Q = require('q');

function copy(reader, writer) {
var deferred;
var ignore;






reader.filter = filterSymlinks;
reader.follow = false;

if (reader.type === 'Directory' && reader.ignore) {
ignore = reader.ignore;
reader = fstreamIgnore(reader);
reader.addIgnoreRules(ignore);
} else {
reader = fstream.Reader(reader);
}

deferred = Q.defer();

reader
.on('error', deferred.reject)

.pipe(fstream.Writer(writer))
.on('error', deferred.reject)
.on('close', deferred.resolve);

return deferred.promise;
}

function copyMode(src, dst) {
return Q.nfcall(fs.stat, src).then(function(stat) {
return Q.nfcall(fs.chmod, dst, stat.mode);
});
}

function filterSymlinks(entry) {
return entry.type !== 'SymbolicLink';
}

function parseOptions(opts) {
