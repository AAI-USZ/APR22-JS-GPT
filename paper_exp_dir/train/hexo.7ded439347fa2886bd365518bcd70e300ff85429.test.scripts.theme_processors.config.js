'use strict';

const should = require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('config', () => {
const Hexo = require('../../../lib/hexo');
