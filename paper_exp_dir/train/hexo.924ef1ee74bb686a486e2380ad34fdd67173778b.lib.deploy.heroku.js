var async = require('async'),
clc = require('cli-color'),
_ = require('underscore'),
fs = require('fs'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

var displayHelp = function(){
var help = [
'',
'You should configure deployment settings in ' + clc.bold('_config.yml') + ' first!',
