var abbrev = require('abbrev');
var mout = require('mout');
var commands = require('./commands');
var PackageRepository = require('./core/PackageRepository');

var abbreviations = abbrev(expandNames(commands));
abbreviations.i = 'install';
abbreviations.rm = 'uninstall';
