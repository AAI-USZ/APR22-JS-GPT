'use strict';

const { join, extname } = require('path');
const moment = require('moment');
const Promise = require('bluebird');
const { Permalink } = require('hexo-util');
const fs = require('hexo-fs');
let permalink;

const reservedKeys = {
year: true,
month: true,
i_month: true,
day: true,
