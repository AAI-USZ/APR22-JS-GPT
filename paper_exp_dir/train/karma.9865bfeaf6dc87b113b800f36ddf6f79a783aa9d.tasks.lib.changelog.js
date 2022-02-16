#!/usr/bin/env node




var child = require('child_process');
var util = require('util');
var q = require('qq');

var GIT_LOG_CMD = 'git log --grep="%s" -E --format=%s %s..HEAD';
var GIT_TAG_CMD = 'git describe --tags --abbrev=0';

var PATCH_HEADER_TPL = '<a name="%s"></a>\n### %s (%s)\n\n';
var MINOR_HEADER_TPL = '<a name="%s"></a>\n## %s (%s)\n\n';
var LINK_ISSUE = '[#%s](https://github.com/testacular/testacular/issues/%s)';
var LINK_COMMIT = '[%s](https://github.com/testacular/testacular/commit/%s)';
