







var events = require('events');
var nopt   = require('nopt');
var _      = require('lodash');

var template  = require('../util/template');
var config    = require('../core/config');

module.exports = function (name) {
var context      = {};
var emitter      = new events.EventEmitter;
var commands     = require('../commands');



switch (name) {
case 'ls':
name = 'list';
break;
}

var validCommand = !!(name  && commands[name]);
var templateName = validCommand ? 'help-' + name : 'help';

if (!validCommand) context = {
commands: Object.keys(commands).sort().join(', ')
}

_.extend(context, config);

template(templateName, context)
.on('data', emitter.emit.bind(emitter, 'end'));

return emitter;
};

