var fs = require('fs');
var path = require('path');

var BaseBrowser = require('./Base');


var SafariBrowser = function() {
BaseBrowser.apply(this, arguments);

this.start = function(url) {
var HTML_TPL = path.normalize(__dirname + '/../../static/safari.html');
var self = this;
