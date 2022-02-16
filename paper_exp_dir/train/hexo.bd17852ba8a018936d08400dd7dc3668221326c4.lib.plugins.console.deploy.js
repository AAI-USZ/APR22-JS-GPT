var _ = require('lodash');
var fs = require('hexo-fs');

require('colors');

module.exports = function(args){
var config = this.config.deploy;
var deployers = this.extend.deployer.list();
var self = this;

if (!config){
var help = '';

