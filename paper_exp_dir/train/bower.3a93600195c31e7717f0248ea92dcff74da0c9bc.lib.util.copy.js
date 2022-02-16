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
deferred.reject(err);
} else {
deferred.resolve();
}
