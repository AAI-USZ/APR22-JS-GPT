var os = require('os');
var path = require('path');
var osenv = require('osenv');
var crypto = require('crypto');

function generateFakeUser() {
var uid =
process.pid +
'-' +
Date.now() +
'-' +
Math.floor(Math.random() * 1000000);
return crypto
.createHash('md5')
.update(uid)
.digest('hex');
