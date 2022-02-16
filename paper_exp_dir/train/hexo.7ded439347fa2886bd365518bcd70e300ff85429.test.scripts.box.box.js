'use strict';

require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const util = require('hexo-util');
const sinon = require('sinon');
const Pattern = util.Pattern;

