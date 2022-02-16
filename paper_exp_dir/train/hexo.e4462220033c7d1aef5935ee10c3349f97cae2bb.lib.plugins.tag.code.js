'use strict';



const { escapeHTML, highlight } = require('hexo-util');

const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/\S+)\s+(.+)/i;
const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/\S+)/i;
const rCaption = /\S[\S\s]*/;



function getHighlightOptions(config, args) {
const _else = [];
const len = args.length;
let lang = '';
