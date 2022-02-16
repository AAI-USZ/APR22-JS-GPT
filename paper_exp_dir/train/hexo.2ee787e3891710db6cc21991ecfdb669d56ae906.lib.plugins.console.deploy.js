'use strict';

const _ = require('lodash');
const fs = require('hexo-fs');
const chalk = require('chalk');
const Promise = require('bluebird');

function deployConsole(args) {
let config = this.config.deploy;
const deployers = this.extend.deployer.list();
const self = this;

if (!config) {
let help = '';

help += 'You should configure deployment settings in _config.yml first!\n\n';
help += 'Available deployer plugins:\n';
help += `  ${Object.keys(deployers).join(', ')}\n\n`;
help += `For more help, you can check the online docs: ${chalk.underline('http://hexo.io/')}`;
