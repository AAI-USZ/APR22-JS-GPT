#!/usr/bin/env node



var exec = require('child_process').exec;
var version;

if (/0\.10/.test(process.versions.node)) {
version = '0.6.2';
