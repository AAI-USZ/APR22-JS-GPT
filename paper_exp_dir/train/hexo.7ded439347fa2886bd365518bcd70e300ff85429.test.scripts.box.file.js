'use strict';

const should = require('chai').should();
const pathFn = require('path');
const Promise = require('bluebird');
const fs = require('hexo-fs');
const yaml = require('js-yaml');
const _ = require('lodash');

describe('File', () => {
