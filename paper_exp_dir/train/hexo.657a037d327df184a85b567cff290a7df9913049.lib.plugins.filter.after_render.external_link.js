'use strict';

const { isExternalLink } = require('hexo-util');
let EXTERNAL_LINK_SITE_CONFIG;
let EXTERNAL_LINK_SITE_ENABLED = true;

function externalLinkFilter(data) {
if (!EXTERNAL_LINK_SITE_ENABLED) return;

const { config } = this;

if (typeof EXTERNAL_LINK_SITE_CONFIG === 'undefined') {
if (typeof config.external_link === 'undefined' || typeof config.external_link === 'object'

|| config.external_link === true) {
EXTERNAL_LINK_SITE_CONFIG = Object.assign({
enable: true,
field: 'site',
exclude: []
}, config.external_link);
}
}

if (config.external_link === false || EXTERNAL_LINK_SITE_CONFIG.enable === false
