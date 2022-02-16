'use strict';

var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');

function Scaffold(context){
this.context = context;
this.scaffoldDir = context.scaffold_dir;
this.assetDir = pathFn.join(context.core_dir, 'assets', 'scaffolds');
