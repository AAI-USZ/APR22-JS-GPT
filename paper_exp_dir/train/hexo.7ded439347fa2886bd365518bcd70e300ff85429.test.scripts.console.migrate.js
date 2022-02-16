'use strict';

require('chai').should();
const sinon = require('sinon');

describe('migrate', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname, {silent: true});
const migrate = require('../../../lib/plugins/console/migrate').bind(hexo);

