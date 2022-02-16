'use strict';

const { extname } = require('path');
const { inherits } = require('util');
const Box = require('../box');
const View = require('./view');
const I18n = require('hexo-i18n');

function Theme(ctx) {
Reflect.apply(Box, this, [ctx, ctx.theme_dir]);

this.config = {};

this.views = {};

this.processors = [
