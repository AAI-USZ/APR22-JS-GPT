#!/usr/bin/env node
'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');


var rimraf = require('./rimraf');

var isWin = !!process.platform.match(/^win/);

var pathTo = function(p) {
return path.resolve(__dirname + '/../' + p);
};

var scriptPath = pathTo('node_modules/grunt-conventional-changelog/lib/validate-commit-msg.js');
var gitHookPath = pathTo('.git/hooks/commit-msg');
