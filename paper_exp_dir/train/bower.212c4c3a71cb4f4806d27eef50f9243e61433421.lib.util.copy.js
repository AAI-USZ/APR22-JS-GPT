var fstream = require('fstream');
var fstreamIgnore = require('fstream-ignore');
var fs = require('graceful-fs');
var Q = require('q');

function copy(reader, writer) {
var deferred;
var ignore;


reader.follow = true;
reader.filter = filterSymlinks;

if (reader.type === 'Directory' && reader.ignore) {
ignore = reader.ignore;
reader = fstreamIgnore(reader);
reader.addIgnoreRules(ignore);
} else {
reader = fstream.Reader(reader);
