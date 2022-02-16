

var sudoBlock = require('sudo-block');
var createError = require('./createError');
var cli = require('./cli');

var renderer;

function rootCheck(options, config) {
var errorMsg;

if (options.allowRoot) {

return;
}

errorMsg = 'Since bower is a user command, there is no need to execute it with \
superuser permissions.\nIf you\'re having permission errors when using bower without \
sudo, please spend a few minutes learning more about how your system should work and \
