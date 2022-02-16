var Emitter = require('events').EventEmitter;
var Project = require('../core/Project');
var cli = require('../util/cli');
var help = require('./help');

function install(endpoints, options) {
    var project;
    var emitter = new Emitter();

    options = options || {};

    // If endpoints are an empty array, null them
    if (endpoints && !endpoints.length) {
        endpoints = null;
    }

    project = new Project(options);
    project.install(endpoints)
    .then(function (installed) {
        emitter.emit('end', installed);
    }, function (error) {
        emitter.emit('error', error);
    }, function (notification) {
        emitter.emit('data', notification);
    });

    return emitter;
}

// -------------------

module.exports = install;

module.exports.line = function (argv) {
    var options = module.exports.options(argv);

    return options.help ?
    help('install') :
    install(options.argv.remain.slice(1), options);
};

module.exports.options = function (argv) {
    return cli.readOptions(argv, {
        'save': { type: Boolean, shorthand: 'S' },
        'save-dev': { type: Boolean, shorthand: 'D' },
        'force': { type: Boolean, shorthand: 'f' },
        'offline': { type: Boolean, shorthand: 'o' },
        'production': { type: Boolean, shorthand: 'p' }
    });
};
