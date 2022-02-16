'use strict';

var bunyan = require('bunyan');
var moment = require('moment');
var chalk = require('chalk');

var dateFormat = 'HH:mm:ss.SSS';

var levelNames = {
10: 'TRACE',
20: 'DEBUG',
