'use strict';

var _ = require('lodash');
var fs = require('hexo-fs');
var chalk = require('chalk');
var Promise = require('bluebird');

function deployConsole(args) {
var config = this.config.deploy;
var deployers = this.extend.deployer.list();
var self = this;

if (!config) {
var help = '';

help += 'You should configure deployment settings in _config.yml first!\n\n';
help += 'Available deployer plugins:\n';
