var Pattern = require('../../box/pattern');
var pathFn = require('path');

exports.process = function(file){
var path = file.params.path;

if (file.type === 'delete'){
