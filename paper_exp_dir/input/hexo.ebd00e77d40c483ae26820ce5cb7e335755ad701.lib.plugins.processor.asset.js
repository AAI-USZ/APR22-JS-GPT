'use strict';

const common = require('./common');
const Promise = require('bluebird');
const yfm = require('hexo-front-matter');
const pathFn = require('path');
const util = require('hexo-util');

module.exports = ctx => {
function processPage(file) {
const Page = ctx.model('Page');
const doc = Page.findOne({source: path});
