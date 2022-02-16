var spawn = require('child_process').spawn;
var path = require('path');
var log = require('./logger').create('launcher');
var env = process.env;
var fs = require('fs');
var util = require('./util');


var generate = {
id: function() {
return Math.floor(Math.random() * 100000000);
}
};



var Browser = function(id) {

var exitCallback = function() {};
