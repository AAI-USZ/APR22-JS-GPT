'use strict';

var crypto = require('crypto');
var querystring = require('querystring');

function md5(str){
return crypto.createHash('md5').update(str).digest('hex');
}

function gravatarHelper(email, options){
