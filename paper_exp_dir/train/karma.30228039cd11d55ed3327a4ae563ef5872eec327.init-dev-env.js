#!/usr/bin/env node
'use strict';

var fs = require('fs');
var exec = require('child_process').exec;

var isWin = !!process.platform.match(/^win/);

var validateCommitPath = '../../scripts/validate-commit-msg.js';
var gitHookPath = __dirname+'/../.git/hooks/commit-msg';

var nodeModulesPath = __dirname+'/../node_modules';
var karmaPath = '..';
var nmKarmaPath = __dirname+'/../node_modules/karma';


var gitHookSetup = function(){

if (fs.existsSync(gitHookPath)) {
fs.unlinkSync(gitHookPath);
console.log('Existing link removed:', gitHookPath);
}

