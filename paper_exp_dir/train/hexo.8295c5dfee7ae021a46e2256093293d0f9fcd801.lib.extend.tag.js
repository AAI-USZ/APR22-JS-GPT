'use strict';

const stripIndent = require('strip-indent');
const chalk = require('chalk');
const nunjucks = require('nunjucks');
const { inherits } = require('util');
const Promise = require('bluebird');

function Tag() {
this.env = new nunjucks.Environment(null, {
autoescape: false
});
}
