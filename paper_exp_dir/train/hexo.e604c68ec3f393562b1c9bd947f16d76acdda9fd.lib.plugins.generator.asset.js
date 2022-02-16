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
