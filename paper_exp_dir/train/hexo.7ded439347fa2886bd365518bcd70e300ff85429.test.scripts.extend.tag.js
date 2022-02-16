'use strict';

require('chai').should();
const sinon = require('sinon');
const Promise = require('bluebird');

describe('Tag', () => {
const Tag = require('../../../lib/extend/tag');
const tag = new Tag();

