#!/usr/bin/env node




var child = require('child_process');
var fs = require('fs');
var util = require('util');
var q = require('qq');

var GIT_LOG_CMD = 'git log --grep="%s" -E --format=%s %s..HEAD';
var GIT_TAG_CMD = 'git describe --tags --abbrev=0';

var HEADER_TPL = '<a name="%s"></a>\n## %s (%s)\n\n';
var LINK_ISSUE = '[#%s](https://github.com/vojtajina/testacular/issues/%s)';
var LINK_COMMIT = '[%s](https://github.com/vojtajina/testacular/commit/%s)';

var EMPTY_COMPONENT = '$$';
var MAX_SUBJECT_LENGTH = 80;

var PATTERN = /^(\w*)(\(([\w\$\.\-\*]*)\))?\: (.*)$/;

var warn = function() {
console.log('WARNING:', util.format.apply(null, arguments));
};


var parseRawCommit = function(raw) {
if (!raw) {
return null;
}

var lines = raw.split('\n');
var msg = {}, match;

msg.hash = lines.shift();
msg.subject = lines.shift();
msg.closes = [];
