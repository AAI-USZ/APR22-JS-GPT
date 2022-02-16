'use strict';

const { exists } = require('hexo-fs');
const { underline, magenta } = require('chalk');

function deployConsole(args) {
let config = this.config.deploy;
const deployers = this.extend.deployer.list();

if (!config) {
let help = '';

help += 'You should configure deployment settings in _config.yml first!\n\n';
