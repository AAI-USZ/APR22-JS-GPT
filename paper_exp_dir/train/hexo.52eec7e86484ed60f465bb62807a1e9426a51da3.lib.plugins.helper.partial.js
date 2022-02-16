'use strict';

const { dirname, join } = require('path');
const chalk = require('chalk');

module.exports = ctx => function partial(name, locals, options = {}) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');

const { cache } = options;
const viewDir = this.view_dir;
const currentView = this.filename.substring(viewDir.length);
const path = join(dirname(currentView), name);
const view = ctx.theme.getView(path) || ctx.theme.getView(name);
const viewLocals = { layout: false };

if (!view) {
