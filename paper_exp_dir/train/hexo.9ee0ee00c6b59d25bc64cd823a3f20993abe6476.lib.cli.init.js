'use strict';

var Hexo = require('../hexo');
var findPkg = require('./find_pkg');
var updateNotifier = require('update-notifier');
var pkg = require('../../package.json');
var notifier = updateNotifier({pkg: pkg});

var byeWords = [
'Good bye',
'See you again',
'Farewell',
'Have a nice day',
'Bye!',
'Catch you later'
];

function sayGoodbye(){
return byeWords[(Math.random() * byeWords.length) | 0];
}


process.bin = process.title = 'hexo';

module.exports = function(args){
var cwd = process.cwd();
var hexo;

function exit(err){
if (!hexo) throw err;
return hexo.exit(err);
}


if (notifier.update && !args.silent){
notifier.notify();
}

findPkg(cwd, args).then(function(path){
hexo = new Hexo(path || cwd, args);
