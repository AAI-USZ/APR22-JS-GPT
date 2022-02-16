'use strict';

const { isExternalLink } = require('hexo-util');
let EXTERNAL_LINK_POST_ENABLED = true;
const rATag = /<a(?:\s+?|\s+?[^<>]+\s+?)?href=["']([^<>"']+)["'][^<>]*>/gi;
const rTargetAttr = /target=/i;
const rRelAttr = /rel=/i;
const rRelStrAttr = /rel=["']([^<>"']*)["']/i;

function externalLinkFilter(data) {
if (!EXTERNAL_LINK_POST_ENABLED) return;

const { external_link, url } = this.config;

