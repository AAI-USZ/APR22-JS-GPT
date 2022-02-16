'use strict';

const common = require('./common');
const Promise = require('bluebird');
const yfm = require('hexo-front-matter');
const pathFn = require('path');
const fs = require('hexo-fs');
const util = require('hexo-util');
const slugize = util.slugize;
const Pattern = util.Pattern;
const Permalink = util.Permalink;

const postDir = '_posts/';
const draftDir = '_drafts/';
let permalink;

const preservedKeys = {
