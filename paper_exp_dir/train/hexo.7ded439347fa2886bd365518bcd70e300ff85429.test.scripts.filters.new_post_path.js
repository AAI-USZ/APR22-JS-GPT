'use strict';

require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');
const moment = require('moment');
const Promise = require('bluebird');
const fs = require('hexo-fs');

const NEW_POST_NAME = ':title.md';

