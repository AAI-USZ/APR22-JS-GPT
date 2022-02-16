'use strict';

const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const moment = require('moment');
const sinon = require('sinon');

describe('View', () => {
