'use strict';

const pathFn = require('path');
const moment = require('moment');
const _ = require('lodash');
const Promise = require('bluebird');
const util = require('hexo-util');
const fs = require('hexo-fs');
const Permalink = util.Permalink;
let permalink;

const reservedKeys = {
year: true,
month: true,
i_month: true,
day: true,
i_day: true,
title: true
};

function newPostPathFilter(data = {}, replace) {
