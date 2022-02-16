var path = require('path'),
fs = require('graceful-fs'),
async = require('async'),
_ = require('lodash'),
HexoError = require('../error'),
Theme = require('../theme'),
Source = require('../core/source'),
Scaffold = require('../core/scaffold'),
util = require('../util'),
file = util.file2;

var defaults = {

title: 'Hexo',
subtitle: '',
description: '',
author: 'John Doe',
