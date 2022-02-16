'use strict';

const stripIndent = require('strip-indent');
const { cyan } = require('chalk');
const nunjucks = require('nunjucks');
const Promise = require('bluebird');
const placeholder = '\uFFFC';
const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;

class NunjucksTag {
constructor(name, fn) {
this.tags = [name];
this.fn = fn;
}

