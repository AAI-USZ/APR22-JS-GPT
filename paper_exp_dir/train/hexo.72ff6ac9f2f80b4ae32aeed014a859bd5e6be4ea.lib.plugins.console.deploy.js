var _ = require('lodash');
var fs = require('hexo-fs');
var chalk = require('chalk');

module.exports = function(args){
var config = this.config.deploy;
var deployers = this.extend.deployer.list();
var self = this;

if (!config){
var help = '';

