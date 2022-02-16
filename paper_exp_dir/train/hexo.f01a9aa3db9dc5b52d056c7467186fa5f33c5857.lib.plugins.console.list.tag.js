'use strict';

var chalk = require('chalk');
var table = require('text-table');
var common = require('./common');

function listTag() {
var Tag = this.model('Tag');

var data = Tag.sort({name: 1}).map(function(tag) {
return [tag.name, String(tag.length), chalk.magenta(tag.path)];
});


var header = ['Name', 'Posts', 'Path'].map(function(str) {
return chalk.underline(str);
});
