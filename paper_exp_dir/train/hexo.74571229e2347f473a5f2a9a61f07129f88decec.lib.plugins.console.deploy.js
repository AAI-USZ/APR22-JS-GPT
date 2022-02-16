'use strict';

var _ = require('lodash');
var fs = require('hexo-fs');
var chalk = require('chalk');
var Promise = require('bluebird');

function deployConsole(args){

var config = this.config.deploy;
