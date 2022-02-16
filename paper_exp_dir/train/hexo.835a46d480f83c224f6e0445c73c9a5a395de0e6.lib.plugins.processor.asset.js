'use strict';

const common = require('./common');
const Promise = require('bluebird');
const yfm = require('hexo-front-matter');
const { extname } = require('path');
const { Pattern } = require('hexo-util');

module.exports = ctx => {
function processPage(file) {
const Page = ctx.model('Page');
const { path } = file;
const doc = Page.findOne({source: path});
const { config } = ctx;
const { timezone } = config;

