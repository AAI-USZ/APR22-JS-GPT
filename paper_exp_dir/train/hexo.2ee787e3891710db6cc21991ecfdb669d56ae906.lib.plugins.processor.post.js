'use strict';

const common = require('./common');
const Promise = require('bluebird');
const yfm = require('hexo-front-matter');
const pathFn = require('path');
const fs = require('hexo-fs');
const _ = require('lodash');
const util = require('hexo-util');
const slugize = util.slugize;
const Pattern = util.Pattern;
const Permalink = util.Permalink;
