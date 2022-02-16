'use strict';

var fs = require('hexo-fs');
var Promise = require('bluebird');
var pathFn = require('path');
var chalk = require('chalk');

function assetGenerator(locals){

var self = this;
