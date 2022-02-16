'use strict';

function listArchivesHelper(options = {}) {
const config = this.config;
const archiveDir = config.archive_dir;
const timezone = config.timezone;
const lang = this.page.lang || this.page.language || config.language;
let format = options.format;
const type = options.type || 'monthly';
const style = options.hasOwnProperty('style') ? options.style : 'list';
const showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
const transform = options.transform;
