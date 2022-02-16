var Hexo = require('../hexo');
var pathFn = require('path');
var fs = require('hexo-fs');

var cwd = process.cwd();
var lastCwd = cwd;

var byeWords = [
'Good bye',
'See you again',
'Farewell',
'Have a nice day',
'Bye!',
