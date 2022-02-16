'use strict';

const crypto = require('crypto');

describe('gravatar', () => {
const gravatar = require('../../../lib/plugins/helper/gravatar');

function md5(str) {
return crypto.createHash('md5').update(str).digest('hex');
}

const email = 'abc@abc.com';
const hash = md5(email);
