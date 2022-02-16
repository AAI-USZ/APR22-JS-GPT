'use strict';

var url = require('url');

function urlForHelper(path, options){

path = path || '/';
options = options || {};

var config = this.config;
var root = config.root;
var data = url.parse(path);
