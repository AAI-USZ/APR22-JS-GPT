var pathFn = require('path');
var tildify = require('tildify');
var prettyHrtime = require('pretty-hrtime');
var fs = require('hexo-fs');
var chalk = require('chalk');

function renderConsole(args){

if (!args._.length){
return this.call('help', {_: 'render'});
