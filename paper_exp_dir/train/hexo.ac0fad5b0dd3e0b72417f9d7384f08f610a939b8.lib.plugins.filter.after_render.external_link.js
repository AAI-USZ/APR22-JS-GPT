'use strict';

const { parse } = require('url');


const isExternal = (url, config) => {
const exclude = config.external_link.exclude;
const data = parse(url);
const host = data.hostname;
const sitehost = parse(config.url).hostname || config.url;

if (!data.protocol || !sitehost) return false;

if (exclude && exclude.length) {
