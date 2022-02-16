'use strict';

var Promise = require('bluebird');
var fs = require('hexo-fs');

function cleanConsole(args){

return Promise.all([
deleteDatabase(this),
deletePublicDir(this)
