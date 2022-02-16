'use strict';

const should = require('chai').should();
const Promise = require('bluebird');
const Readable = require('stream').Readable;
const pathFn = require('path');
const crypto = require('crypto');
const fs = require('hexo-fs');
const sinon = require('sinon');
const testUtil = require('../../util');
