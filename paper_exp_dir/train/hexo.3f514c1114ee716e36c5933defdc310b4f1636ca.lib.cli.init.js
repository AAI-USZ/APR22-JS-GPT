var Hexo = require('../hexo');
var findConfig = require('./find_config');
var updateNotifier = require('update-notifier');
var pkg = require('../../package.json');
var notifier = updateNotifier({pkg: pkg});

var byeWords = [
'Good bye',
'See you again',
'Farewell',
'Have a nice day',
'Bye!',
