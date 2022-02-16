#!/usr/bin/env node
'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var isWin = !!process.platform.match(/^win/);

var pathTo = function(p) {
return path.resolve(__dirname + '/../' + p);
};

var validateCommitPath = pathTo('scripts/validate-commit-msg.js');
var gitHookPath = pathTo('.git/hooks/commit-msg');
