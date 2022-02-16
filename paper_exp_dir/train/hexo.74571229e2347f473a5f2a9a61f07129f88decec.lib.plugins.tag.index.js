'use strict';

module.exports = function(ctx){
var tag = ctx.extend.tag;

var blockquote = require('./blockquote')(ctx);

tag.register('quote', blockquote, true);
tag.register('blockquote', blockquote, true);

var code = require('./code')(ctx);

