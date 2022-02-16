var Promise = require('bluebird');
var util = require('../util');
var fs = util.fs;

function File(data){
this.source = data.source;
this.path = data.path;
this.type = data.type;
this.params = data.params;

