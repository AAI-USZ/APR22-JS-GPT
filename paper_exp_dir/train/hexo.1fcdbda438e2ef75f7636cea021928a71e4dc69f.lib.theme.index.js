'use strict';

const { extname } = require('path');
const Box = require('../box');
const View = require('./view');
const I18n = require('hexo-i18n');

class Theme extends Box {
constructor(ctx) {
super(ctx, ctx.theme_dir);

this.config = {};

