var tty = require('tty');
var mout = require('mout');
var config = require('bower-config').read();
var cli = require('./util/cli');



delete config.json;


if (config.interactive == null) {
config.interactive = process.bin === 'bower' && tty.isatty(1);
}



if (config.analytics == null) {

config.analytics = config.interactive && !process.env.CI;
}


mout.object.mixIn(config, cli.readOptions({
force: { type: Boolean, shorthand: 'f' },
offline: { type: Boolean, shorthand: 'o' },
verbose: { type: Boolean, shorthand: 'V' },
quiet: { type: Boolean, shorthand: 'q' },
loglevel: { type: String, shorthand: 'l' },
