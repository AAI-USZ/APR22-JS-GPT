'use strict';

const rewire = require('rewire');
const sinon = require('sinon');

describe('debug', () => {
const debug = require('../../../lib/plugins/helper/debug');
const debugModule = rewire('../../../lib/plugins/helper/debug');
const inspect = require('util').inspect;

