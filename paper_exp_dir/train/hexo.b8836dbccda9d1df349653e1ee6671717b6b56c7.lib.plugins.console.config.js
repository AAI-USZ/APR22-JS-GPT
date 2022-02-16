'use strict';

var yaml = require('js-yaml');
var fs = require('hexo-fs');
var pathFn = require('path');

function configConsole(args){

var key = args._[0];
var value = args._[1];
var self = this;

if (!key){
console.log(this.config);
return;
}

if (!value){
value = getProperty(this.config, key);
