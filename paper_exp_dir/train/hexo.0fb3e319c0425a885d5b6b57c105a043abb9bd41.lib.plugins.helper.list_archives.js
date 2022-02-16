'use strict';

const { toMomentLocale } = require('./date');
const { url_for } = require('hexo-util');

function listArchivesHelper(options = {}) {
const { config } = this;
const archiveDir = config.archive_dir;
const { timezone } = config;
const lang = toMomentLocale(this.page.lang || this.page.language || config.language);
let { format } = options;
const type = options.type || 'monthly';
const { style = 'list', transform, separator = ', ' } = options;
