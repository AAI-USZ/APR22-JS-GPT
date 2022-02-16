'use strict';

const tildify = require('tildify');
const chalk = require('chalk');

function publishConsole(args) {

if (!args._.length) {
return this.call('help', {_: ['publish']});
}

