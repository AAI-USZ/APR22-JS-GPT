'use strict';



const { escapeHTML, highlight } = require('hexo-util');

const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i;
const rCaption = /(\S[\S\s]*)/;
const rLang = /\s*lang:(\w+)/i;
const rLineNumber = /\s*line_number:(\w+)/i;
const rHighlight = /\s*highlight:(\w+)/i;
const rFirstLine = /\s*first_line:(\d+)/i;
const rMark = /\s*mark:([0-9,-]+)/i;
const rWrap = /\s*wrap:(\w+)/i;
