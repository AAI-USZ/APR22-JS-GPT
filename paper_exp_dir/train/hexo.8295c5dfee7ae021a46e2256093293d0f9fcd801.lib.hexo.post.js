'use strict';

const moment = require('moment');
const Promise = require('bluebird');
const { join, extname } = require('path');
const assignIn = require('lodash/assignIn');
const clone = require('lodash/clone');
const chalk = require('chalk');
const yaml = require('js-yaml');
const { slugize, escapeRegExp } = require('hexo-util');
const fs = require('hexo-fs');
const yfm = require('hexo-front-matter');

const preservedKeys = ['title', 'slug', 'path', 'layout', 'date', 'content'];

function PostRenderCache() {
this.cache = [];
