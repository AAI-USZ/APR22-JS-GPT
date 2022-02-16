'use strict';

const { Schema } = require('warehouse');
const moment = require('moment');
const { extname, join, sep } = require('path');
const Promise = require('bluebird');
const Moment = require('./types/moment');
const { encodeURL } = require('hexo-util');

function pickID(data) {
return data._id;
}

function removeEmptyTag(tags) {
return tags.filter(tag => tag != null && tag !== '').map(tag => `${tag}`);
}

