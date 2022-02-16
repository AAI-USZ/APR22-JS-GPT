var tty = require('tty');
var mout = require('mout');
var config = require('bower-config').read();
var cli = require('./util/cli');



delete config.json;


if (config.interactive == null) {
config.interactive = (
process.bin === 'bower' &&
tty.isatty(1) &&
!process.env.CI
);
}



if (config.analytics == null) {

config.analytics = config.interactive;
