'use strict';

var crypto = require('crypto');
var should = require('chai').should();

describe('gravatar', () => {
var gravatar = require('../../../lib/plugins/helper/gravatar');

function md5(str) {
return crypto.createHash('md5').update(str).digest('hex');
