.on('resolve', emitter.emit.bind(emitter, 'end', null))
var options = nopt(optionTypes, shorthand, argv);
var paths   = options.argv.remain.slice(1);
