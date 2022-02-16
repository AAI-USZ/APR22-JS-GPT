var tty = require('tty');
var mout = require('mout');
var config = require('bower-config').read();
var cli = require('./util/cli');



delete config.json;


if (config.interactive == null) {
config.interactive = process.bin === 'bower' && tty.isatty(1);
}


mout.object.mixIn(config, cli.readOptions({
force: { type: Boolean, shorthand: 'f' },
offline: { type: Boolean, shorthand: 'o' },
verbose: { type: Boolean, shorthand: 'V' },
quiet: { type: Boolean, shorthand: 'q' },
loglevel: { type: String, shorthand: 'l' },
json: { type: Boolean, shorthand: 'j' },
silent: { type: Boolean, shorthand: 's' }
}));

module.exports = config;
