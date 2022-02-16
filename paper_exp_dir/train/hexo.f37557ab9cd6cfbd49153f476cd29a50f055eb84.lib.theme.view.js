'use strict';

const { dirname, extname, join } = require('path');
const yfm = require('hexo-front-matter');
const Promise = require('bluebird');

const assignIn = (...args) => {
const length = args.length;
const obj = args[0];

if (length < 2 || obj == null) return obj;
for (let index = 1; index < length; index++) {
const source = args[index];
