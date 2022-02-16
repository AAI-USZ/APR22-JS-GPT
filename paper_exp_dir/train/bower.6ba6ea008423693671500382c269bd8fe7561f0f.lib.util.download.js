var progress = require('request-progress');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var retry = require('retry');
var fs = require('graceful-fs');
var createError = require('./createError');

var errorCodes = [
'EADDRINFO',
'ETIMEDOUT',
'ECONNRESET',
'ESOCKETTIMEDOUT'
];

function download(url, file, options) {
var operation;
var response;
var deferred = Q.defer();
var progressDelay = 8000;

options = mout.object.mixIn({
retries: 5,
factor: 2,
minTimeout: 1000,
maxTimeout: 35000,
randomize: true
}, options || {});


operation = retry.operation(options);
operation.attempt(function () {
var req;
var writeStream;

req = progress(request(url, options), {
delay: progressDelay
})
.on('response', function (res) {
var status = res.statusCode;

if (status < 200 || status >= 300) {
