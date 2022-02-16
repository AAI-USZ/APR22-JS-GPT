'use strict';

var stripIndent = require('strip-indent');
var nunjucks = require('nunjucks');
var inherits = require('util').inherits;
var Promise = require('bluebird');

function Tag(){
this.env = new nunjucks.Environment(null, {
autoescape: false
});
}

