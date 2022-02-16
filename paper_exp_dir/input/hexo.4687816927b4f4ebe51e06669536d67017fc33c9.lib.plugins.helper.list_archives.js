'use strict';

const { toMomentLocale } = require('./date');

function listArchivesHelper(options = {}) {
const { config } = this;
const archiveDir = config.archive_dir;
const { timezone } = config;
const lang = toMomentLocale(this.page.lang || this.page.language || config.language);
let { format } = options;
const type = options.type || 'monthly';
const { style = 'list', transform, separator = ', ' } = options;
const showCount = Object.prototype.hasOwnProperty.call(options, 'show_count') ? options.show_count : true;
const className = options.class || 'archive';
const order = options.order || -1;
