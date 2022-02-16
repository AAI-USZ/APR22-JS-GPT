'use strict';

require('chai').should();
const fs = require('hexo-fs');
const pathFn = require('path');
const sinon = require('sinon');

describe('deploy', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'deploy_test'), {silent: true});
