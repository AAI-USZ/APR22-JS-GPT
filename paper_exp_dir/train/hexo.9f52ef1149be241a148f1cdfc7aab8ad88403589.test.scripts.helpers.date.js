'use strict';

const moment = require('moment-timezone');
const sinon = require('sinon');

describe('date', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const dateHelper = require('../../../lib/plugins/helper/date');
let clock;

before(() => {
clock = sinon.useFakeTimers(Date.now());
