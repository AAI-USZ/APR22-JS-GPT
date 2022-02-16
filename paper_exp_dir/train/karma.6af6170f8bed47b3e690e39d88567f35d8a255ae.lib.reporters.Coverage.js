var path = require('path');
var fs = require('fs');
var util = require('util');
var istanbul = require('istanbul');
var dateformat = require('dateformat');

var helper = require('../helper');
var log = require('../logger').create('coverage');

var Store = istanbul.Store;

var BasePathStore = function(opts) {
Store.call(this, opts);
opts = opts || {};
this.basePath = opts.basePath;
this.delegate = Store.create('fslookup');
};
