var mout = require('mout');
var nopt = require('nopt');
var renderers = require('../renderers');

function readOptions(argv, options) {
    var types;
    var shorthands = {};

    // Configure options that are common to all commands
    options.help = { type: Boolean, shorthand: 'h' };
    options.color = { type: Boolean };
    options.silent = { type: Boolean, shorthand: 's' };
    options.json = { type: Boolean };
    options['log-levels'] = { type: String };

    types = mout.object.map(options, function (option) {
        return option.type;
    });
    mout.object.forOwn(options, function (option, name) {
        shorthands[option.shorthand] = '--' + name;
    });

    return nopt(types, shorthands, argv);
}

function getRenderer(options) {
    if (options.silent) {
        return renderers.mute;
    }

    if (options.json) {
        return renderers.json;
    }

    return options.color === false ?
    renderers.cli.colorless :
    renderers.cli.colorful;
}

module.exports.readOptions = readOptions;
module.exports.createRenderer = getRenderer;