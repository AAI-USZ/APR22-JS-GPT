var mout = require('mout');
var config = require('bower-config').read();
var cli = require('./util/cli');


mout.object.mixIn(config, cli.readOptions({
force: { type: Boolean, shorthand: 'f' },
offline: { type: Boolean, shorthand: 'o' },
verbose: { type: Boolean, shorthand: 'V'},
quiet: { type: Boolean, shorthand: 'q' },
