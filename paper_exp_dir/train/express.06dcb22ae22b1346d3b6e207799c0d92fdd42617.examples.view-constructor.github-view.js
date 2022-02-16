

var http = require('http');
var path = require('path');
var extname = path.extname;



module.exports = GithubView;



function GithubView(name, options){
this.name = name;
options = options || {};
this.engine = options.engines[extname(name)];
