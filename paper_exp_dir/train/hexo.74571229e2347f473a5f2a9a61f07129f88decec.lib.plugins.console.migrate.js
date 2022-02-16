'use strict';

var chalk = require('chalk');

function migrateConsole(args){


if (!args._.length){
return this.call('help', {_: ['migrate']});
}

var type = args._.shift();
var migrators = this.extend.migrator.list();
