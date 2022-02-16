var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

if (!fs.exists || !fs.existsSync){
fs.exists = pathFn.exists;
fs.existsSync = pathFn.existsSync;
}

var join = function(parent, child){
return parent + '/' + child;
