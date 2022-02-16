






var Emitter  = require('events').EventEmitter;
var path     = require('path');
var nopt     = require('nopt');
var mkdirp   = require('mkdirp');

var template = require('../util/template');
var complete = require('../util/completion');
var config   = require('../core/config');
var help     = require('./help');

var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'] };

module.exports = function (argv, env) {
env = env || process.env;

var emitter = new Emitter;
var commands = require('../commands');


var flags = ['--no-color', '--help', '--version'];

var done = function done() {
process.nextTick(function () {
emitter.emit('end');
});

return emitter;
};


if (!env.COMP_CWORD) {
template('completion').on('data', emitter.emit.bind(emitter, 'end'));
return emitter;
}


var opts = complete(argv, env);


if (opts.w === 1) {
if (opts.word.charAt(0) === '-') complete.log(flags, opts);
else complete.log(Object.keys(commands), opts);
return done();
}


var parsed = opts.conf = nopt({}, {}, opts.partialWords, 0);
var cmd = parsed.argv.remain[0];


if (!cmd) {
complete.log(Object.keys(commands), opts);
return done();
}


cmd = commands[cmd];

if (cmd && cmd.completion) {

mkdirp(path.join(config.completion), function (err) {
if (err) return emitter.emit('error', err);

var options = cmd.completion.options;
if (options && opts.word.charAt(0) === '-') {
complete.log(Object.keys(options).map(function (option) {
return opts.word.charAt(1) === '-' ? options[option][0] : '-' + option;
}), opts);
return done();
}

cmd.completion(opts, function (err, data) {
