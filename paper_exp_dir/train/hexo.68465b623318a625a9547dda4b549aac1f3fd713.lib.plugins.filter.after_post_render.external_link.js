'use strict';

const { isExternalLink } = require('hexo-util');
let EXTERNAL_LINK_POST_CONFIG;
let EXTERNAL_LINK_POST_ENABLED = true;

function externalLinkFilter(data) {
if (!EXTERNAL_LINK_POST_ENABLED) return;

const { config } = this;

if (typeof EXTERNAL_LINK_POST_CONFIG === 'undefined') {
if (typeof config.external_link === 'undefined' || typeof config.external_link === 'object'
