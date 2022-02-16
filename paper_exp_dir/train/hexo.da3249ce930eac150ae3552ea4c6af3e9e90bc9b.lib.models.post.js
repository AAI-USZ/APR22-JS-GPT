'use strict';

const Schema = require('warehouse').Schema;
const moment = require('moment');
const pathFn = require('path');
const Promise = require('bluebird');
const Moment = require('./types/moment');

function pickID(data) {
return data._id;
}

function removeEmptyTag(tags) {
return tags.filter(tag => tag != null && tag !== '').map(tag => `${tag}`);
}

