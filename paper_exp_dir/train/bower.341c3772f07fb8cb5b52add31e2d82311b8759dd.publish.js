var tmp = require('tmp');
var fs = require('fs');
var path = require('path');

var childProcess = require('child_process');
var arraydiff = require('arr-diff');
var wrench = require('wrench');

var jsonPackage = require('./package');

if (
childProcess
.execSync('git rev-parse --abbrev-ref HEAD')
.toString()
.trim() !== 'master'
) {
console.log('You need to release bower from the "master" branch');
