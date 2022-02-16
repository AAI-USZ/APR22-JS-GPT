var extend = require('../extend'),
_ = require('underscore');

extend.console.register('version', 'Display verseion', {init: true}, function(args){
var result = [
'hexo: ' + hexo.version
