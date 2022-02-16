var _ = require('lodash'),
vsprintf = require('sprintf-js').vsprintf;

var i18n = module.exports = function i18n(code){
this.data = {};

var language = [];

if (Array.isArray(code)){
language = code;
} else if (code){
