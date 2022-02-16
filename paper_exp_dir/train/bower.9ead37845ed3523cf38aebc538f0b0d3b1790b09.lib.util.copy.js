var fstream = require('fstream');
var fstreamIgnore = require('fstream-ignore');
var fs = require('fs');
var Q = require('q');

function copy(reader, writer) {
var deferred = Q.defer(),
ignore,
finish;

finish = function (err) {
writer.removeAllListeners();
reader.removeAllListeners();


if (err) {
return deferred.reject(err);
}

return deferred.resolve();
};


if (reader.type === 'Directory' && reader.ignore) {
ignore = reader.ignore;
reader = fstreamIgnore(reader);
reader.addIgnoreRules(ignore);
} else {
reader = fstream.Reader(reader);
}

reader.on('error', finish);


writer = fstream.Writer(writer)
.on('error', finish)
.on('close', finish);


reader.pipe(writer);

return deferred.promise;
}

function copyMode(src, dst) {
return Q.nfcall(fs.stat, src)
.then(function (stat) {
return Q.nfcall(fs.chmod, dst, stat.mode);
});
}

function parseOptions(opts) {
opts = opts || {};

if (opts.mode != null) {
opts.copyMode = false;
} else if (opts.copyMode == null) {
opts.copyMode = true;
}

return opts;
}






function copyFile(src, dst, opts) {
var promise;

opts = parseOptions(opts);

promise = copy({
path: src,
type: 'File'
}, {
path: dst,
mode: opts.mode,
type: 'File'
});

if (opts.copyMode) {
promise = promise.then(copyMode.bind(copyMode, src, dst));
}

return promise;
}





function copyDir(src, dst, opts) {
var promise;

opts = parseOptions(opts);

promise = copy({
path: src,
type: 'Directory',
ignore: opts.ignore
}, {
path: dst,
mode: opts.mode,
type: 'Directory'
});

if (opts.copyMode) {
promise = promise.then(copyMode.bind(copyMode, src, dst));
}

return promise;
}

module.exports.copyDir = copyDir;
module.exports.copyFile = copyFile;
