

var fs = require('graceful-fs'),
path = require('path'),
async = require('async'),
_ = require('lodash'),
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

if (!fs.exists || !fs.existsSync){
fs.exists = path.exists;
fs.existsSync = path.existsSync;
