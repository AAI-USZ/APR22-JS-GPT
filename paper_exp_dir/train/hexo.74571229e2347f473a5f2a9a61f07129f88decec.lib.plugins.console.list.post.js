'use strict';

var chalk = require('chalk');
var table = require('text-table');
var common = require('./common');

function listPost(){

var Post = this.model('Post');

