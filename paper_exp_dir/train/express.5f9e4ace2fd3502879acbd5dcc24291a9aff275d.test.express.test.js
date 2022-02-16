
var express = require('express'),
connect = require('connect');

module.exports = {
'test .version': function(assert){
assert.ok(/^\d+\.\d+\.\d+$/.test(express.version), 'Test express.version format');
},
