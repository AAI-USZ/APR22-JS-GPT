'use strict';

const assignIn = require('lodash/assignIn');
const clone = require('lodash/clone');
const fs = require('hexo-fs');
const chalk = require('chalk');
const Promise = require('bluebird');

function deployConsole(args) {
let config = this.config.deploy;
const deployers = this.extend.deployer.list();
const self = this;
