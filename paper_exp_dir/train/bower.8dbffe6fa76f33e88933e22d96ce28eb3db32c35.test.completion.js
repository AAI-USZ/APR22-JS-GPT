

var fs     = require('fs');
var path   = require('path');
var assert = require('assert');

var complete = require('../lib/util/completion');
var config   = require('../lib/core/config');
var command  = require('../lib/commands/completion');
var commands = require('../lib/commands');

describe('completion', function () {

before(function () {
this.opts = complete(['bower', 'install'], {
COMP_CWORD: '2',
COMP_LINE: 'bower install',
