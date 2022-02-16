var fs = require('fs'),
clc = require('cli-color'),
path = require('path'),
async = require('async'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

var displayHelp = function(){
var help = [
'',
'You should configure deployment settings in ' + clc.bold('_config.yml') + ' first!',
