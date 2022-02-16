var util = require('util');
var growly = require('growly');
var path = require('path');

var helper = require('../helper');
var log = require('../logger').create('reporter');

var MSG_SUCCESS = '%d tests passed in %s.';
var MSG_FAILURE = '%d/%d tests failed in %s.';
var MSG_ERROR = '';

var OPTIONS = {
success: {
dispname: 'Success',
title: 'PASSED - %s',
