var moment = require('moment'),
should = require('should'),
crypto = require('crypto'),
marked = require('marked');

describe('Helper', function(){
var config = hexo.config;

describe('css', function(){
var css = require('../lib/plugins/helper/css');

var genResult = function(arr){
