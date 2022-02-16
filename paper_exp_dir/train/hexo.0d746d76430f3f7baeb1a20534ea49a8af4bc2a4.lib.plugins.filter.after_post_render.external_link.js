'use strict';

const { isExternalLink } = require('hexo-util');

function externalLinkFilter(data) {
const { config } = this;

if (typeof config.external_link === 'undefined' || typeof config.external_link === 'object'
|| config.external_link === true) {
config.external_link = Object.assign({
enable: true,
field: 'site',
exclude: []
