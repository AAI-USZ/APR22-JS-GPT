require('colors');
var mout = require('mout');
var template = require('../util/template');

var wideCommands = ['install', 'update'];

function StandardRenderer(command, config) {
this._sizes = {
id: 10,
label: 23,
sumup: 5
};
