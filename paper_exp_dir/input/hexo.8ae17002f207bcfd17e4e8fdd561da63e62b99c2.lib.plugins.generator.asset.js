'use strict';

const fs = require('hexo-fs');
const Promise = require('bluebird');
const pathFn = require('path');
const chalk = require('chalk');

function assetGenerator(locals) {
const self = this;

function process(name) {
