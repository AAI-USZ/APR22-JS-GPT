var fstream = require('fstream');
var fstreamIgnore = require('fstream-ignore');
var fs = require('fs');
var Q = require('q');

function copy(reader, writer) {
var deferred = Q.defer(),
ignore;


if (reader.type === 'Directory' && reader.ignore) {
ignore = reader.ignore;
reader = fstreamIgnore(reader);
reader.addIgnoreRules(ignore);
} else {
reader = fstream.Reader(reader);
}

