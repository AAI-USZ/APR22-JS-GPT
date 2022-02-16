'use strict';

const { extname, join } = require('path');
const { exists, listDir, readFile, unlink, writeFile } = require('hexo-fs');

class Scaffold {
constructor(context) {
this.context = context;
this.scaffoldDir = context.scaffold_dir;
this.defaults = {
normal: [
'---',
'layout: {{ layout }}',
'title: {{ title }}',
