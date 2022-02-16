'use strict';

const { stripIndent } = require('hexo-util');
const { cyan, magenta, red } = require('chalk');
const { Environment } = require('nunjucks');
const Promise = require('bluebird');
const rSwigRawFullBlock = /{% *raw *%}/;
const rCodeTag = /<code[^<>]*>[\s\S]+?<\/code>/g;
const escapeSwigTag = str => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

class NunjucksTag {
constructor(name, fn) {
this.tags = [name];
this.fn = fn;
}

