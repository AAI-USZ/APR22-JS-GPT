'use strict';



const util = require('hexo-util');
const escapeHTML = util.escapeHTML;
const highlight = util.highlight;
const stripIndent = require('strip-indent');

const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i;
const rCaption = /(\S[\S\s]*)/;
const rLang = /\s*lang:(\w+)/i;
const rLineNumber = /\s*line_number:(\w+)/i;
const rHighlight = /\s*highlight:(\w+)/i;
