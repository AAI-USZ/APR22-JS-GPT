var progress = require('request-progress');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var retry = require('retry');
var createError = require('./createError');
var createWriteStream = require('fs-write-stream-atomic');
var destroy = require('destroy');

var errorCodes = [
'EADDRINFO',
'ETIMEDOUT',
'ECONNRESET',
'ESOCKETTIMEDOUT',
'ENOTFOUND'
];

function download(url, file, options) {
var operation;
var deferred = Q.defer();
var progressDelay = 8000;

options = mout.object.mixIn({
retries: 5,
factor: 2,
minTimeout: 1000,
maxTimeout: 35000,
randomize: true,
progressDelay: progressDelay,
gzip: true
}, options || {});


operation = retry.operation(options);

operation.attempt(function () {
Q.fcall(fetch, url, file, options)
.then(function (response) {
deferred.resolve(response);
})
.progress(function (status) {
deferred.notify(status);
})
.fail(function (error) {

var timeout = operation._timeouts[0];


if (errorCodes.indexOf(error.code) === -1) {
return deferred.reject(error);
}


progressDelay = 0;


if (operation.retry(error)) {
deferred.notify({
retry: true,
delay: timeout,
error: error
});
} else {
deferred.reject(error);
}
});
});

return deferred.promise;
}

function fetch(url, file, options) {
var deferred = Q.defer();

var contentLength;
var bytesDownloaded = 0;

var reject = function (error) {
deferred.reject(error);
};

var req = progress(request(url, options), {
delay: options.progressDelay
})
.on('response', function (response) {
contentLength = Number(response.headers['content-length']);

var status = response.statusCode;

if (status < 200 || status >= 300) {
return deferred.reject(createError('Status code of ' + status, 'EHTTP'));
}

var writeStream = createWriteStream(file);
var errored = false;


req.removeListener('error', reject);
req.on('error', function (error) {
errored = true;
destroy(req);
destroy(writeStream);



setTimeout(function () {
deferred.reject(error);
}, 50);
});

writeStream.on('finish', function () {
if (!errored) {
destroy(req);
deferred.resolve(response);
}
});

req.pipe(writeStream);
})
.on('data', function (data) {
bytesDownloaded += data.length;
})
.on('progress', function (state) {
deferred.notify(state);
})
.on('error', reject)
.on('end', function () {




if (contentLength && bytesDownloaded < contentLength) {
req.emit('error', createError(
'Transfer closed with ' + (contentLength - bytesDownloaded) + ' bytes remaining to read',
'EINCOMPLETE'
));
}
});

return deferred.promise;
}

module.exports = download;
