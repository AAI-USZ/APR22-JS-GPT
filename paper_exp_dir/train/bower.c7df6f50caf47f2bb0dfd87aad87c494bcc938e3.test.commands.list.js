var expect = require('expect.js');
var object = require('mout').object;
var path = require('path');

var helpers = require('../helpers');

var commands = {
install: helpers.command('install'),
list: helpers.command('list')
};

describe('bower list', function () {
