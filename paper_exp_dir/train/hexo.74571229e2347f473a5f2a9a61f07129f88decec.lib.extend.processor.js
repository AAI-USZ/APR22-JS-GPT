'use strict';

var Promise = require('bluebird');
var Pattern = require('hexo-util').Pattern;

function Processor(){
this.store = [];
}

Processor.prototype.list = function(){
