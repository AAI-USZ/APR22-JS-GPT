'use strict';

var chalk = require('chalk');

function helpConsole(args){

var command = args._[0];
var list = this.extend.console.list();
var str = '';
var item, options;

