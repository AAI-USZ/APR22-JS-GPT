var extend = require('../../extend'),
helpers = require('swig/lib/helpers');

extend.swig.register('for', function(indent, parser){
var args = this.args,
