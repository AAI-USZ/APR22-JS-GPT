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
'ESOCKETTIMEDOUT'
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
progressDelay: progressDelay
}, options || {});


operation = retry.operation(options);

operation.attempt(function () {
Q.fcall(fetch, url, options)
.then(function(response) {
response.on('progress', function (state) {
deferred.notify(state);
});

var writeStream = createWriteStream(file);


writeStream.on('error', function (error) {
destroy(writeStream);
deferred.reject(error);
