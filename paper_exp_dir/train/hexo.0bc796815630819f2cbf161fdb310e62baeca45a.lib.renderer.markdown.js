var marked = require('marked'),
_ = require('underscore'),
highlight = require('../util').highlight,
extend = require('../extend');

var regex = {
backtick: /^`{3}\s*([^\n]+)\n([^`]+)/,
captionUrl: /([^\s]+)\s*(.*)(https?:\/\/\S+)\s*(.*)/,
caption: /([^\s]+)\s*(.*)/
};

marked.setOptions({
