'use strict';

var fs = require('hexo-fs');
var Promise = require('bluebird');
var pathFn = require('path');
var chalk = require('chalk');

function assetGenerator(locals){

var self = this;

function process(name){
return Promise.filter(self.model(name).toArray(), function(asset){
return fs.exists(asset.source).then(function(exist){
if (exist) return exist;
return asset.remove().thenReturn(exist);
});
}).map(function(asset){
var source = asset.source;
var path = asset.path;
var data = {
modified: asset.modified
};

if (self.render.isRenderable(path)){

var extname = pathFn.extname(path);
var filename = path.substring(0, path.length - extname.length);

path = filename + '.' + self.render.getOutput(path);

data.data = function(){
