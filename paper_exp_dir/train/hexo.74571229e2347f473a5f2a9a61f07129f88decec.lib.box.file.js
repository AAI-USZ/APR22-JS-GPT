'use strict';

var fs = require('hexo-fs');
var Promise = require('bluebird');

function File(data){
this.source = data.source;
this.path = data.path;
this.type = data.type;
this.params = data.params;
