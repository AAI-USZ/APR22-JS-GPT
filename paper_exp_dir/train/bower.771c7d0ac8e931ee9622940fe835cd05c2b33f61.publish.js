var tmp = require('tmp');
var fs = require('fs');
var path = require('path');
var glob = require('glob');

var childProcess = require('child_process');
var arraydiff = require('arr-diff');
var wrench = require('wrench');

var jsonPackage = require('./package');

if (
childProcess
