'use strict';

var bunyan = require('bunyan');
var moment = require('moment');
var chalk = require('chalk');
var Writable = require('stream').Writable;

var dateFormat = 'HH:mm:ss.SSS';

var levelNames = {
10: 'TRACE',
20: 'DEBUG',
30: 'INFO ',
40: 'WARN ',
50: 'ERROR',
