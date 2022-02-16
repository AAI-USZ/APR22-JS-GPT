var express = require('express'),
term = require('term'),
path = require('path'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config;

extend.console.register('preview', 'Preview site', function(args){
var app = express(),
generate = require('../../generate');

if (args.p){
