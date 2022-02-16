var abbrev = require('abbrev');
var mout = require('mout');
var commands = require('./commands');

var abbreviations = abbrev(expandNames(commands));
abbreviations.i = 'install';
abbreviations.rm = 'uninstall';
abbreviations.unlink = 'uninstall';
abbreviations.ls = 'list';

function expandNames(obj, prefix, stack) {
prefix = prefix || '';
stack = stack || [];
