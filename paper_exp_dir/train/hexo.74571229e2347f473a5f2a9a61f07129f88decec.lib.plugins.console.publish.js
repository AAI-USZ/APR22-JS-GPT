'use strict';

var tildify = require('tildify');
var chalk = require('chalk');

function publishConsole(args){


if (!args._.length){
return this.call('help', {_: ['publish']});
}
