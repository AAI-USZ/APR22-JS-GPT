'use strict';

var chalk = require('chalk');
var table = require('text-table');
var common = require('./common');

function listCategory() {
var categories = this.model('Category');

var data = categories.sort({name: 1}).map(function(cate) {
return [cate.name, String(cate.length)];
});


var header = ['Name', 'Posts'].map(function(str) {
return chalk.underline(str);
});
