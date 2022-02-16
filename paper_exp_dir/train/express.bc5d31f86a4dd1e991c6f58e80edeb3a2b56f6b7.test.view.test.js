


var express = require('express'),
connect = require('connect'),
view = require('express/view');

view.helpers.reverse = function(str){
return str.split('').reverse().join('');
};

module.exports = {
'test #render()': function(assert){
var app = express.createServer(connect.errorHandler({ showMessage: true }));
