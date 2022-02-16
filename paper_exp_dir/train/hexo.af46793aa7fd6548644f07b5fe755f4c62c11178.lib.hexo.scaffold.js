'use strict';

var pathFn = require('path');
var fs = require('hexo-fs');

function Scaffold(context){
this.context = context;
this.scaffoldDir = context.scaffold_dir;
}

Scaffold.prototype.defaults = {
normal: [
'layout: {{ layout }}',
