var fstream = require('fstream');
var fstreamIgnore = require('fstream-ignore');
var fs = require('graceful-fs');
var Q = require('q');

function copy(reader, writer) {
var deferred;
var ignore;



