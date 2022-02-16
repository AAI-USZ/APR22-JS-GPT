'use strict';

const pathFn = require('path');
const assignIn = require('lodash/assignIn');
const omit = require('lodash/omit');
const yfm = require('hexo-front-matter');
const Promise = require('bluebird');

function View(path, data) {
this.path = path;
this.source = pathFn.join(this._theme.base, 'layout', path);
this.data = typeof data === 'string' ? yfm(data) : data;

