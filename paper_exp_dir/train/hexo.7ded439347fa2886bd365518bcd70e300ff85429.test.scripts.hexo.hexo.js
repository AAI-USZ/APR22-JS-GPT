'use strict';

const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const sinon = require('sinon');
const sep = pathFn.sep;
const testUtil = require('../../util');

