'use strict';

var chalk = require('chalk');

module.exports = function(args){
var command = args._[0];
var list = this.extend.console.list();

if (list.hasOwnProperty(command) && command !== 'help'){
printHelpForCommand(command, list[command]);
} else {
printAllHelp(list);
}
};
