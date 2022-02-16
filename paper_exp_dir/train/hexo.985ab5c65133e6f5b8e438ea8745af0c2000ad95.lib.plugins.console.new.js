'use strict';

const tildify = require('tildify');
const chalk = require('chalk');

const reservedKeys = {
_: true,
title: true,
layout: true,
slug: true,
path: true,
replace: true,

config: true,
debug: true,
safe: true,
silent: true
};

function newConsole(args) {

if (!args._.length) {
return this.call('help', {_: ['new']});
}

const data = {
title: args._.pop(),
layout: args._.length ? args._[0] : this.config.default_layout,
slug: args.s || args.slug,
path: args.p || args.path
};

const keys = Object.keys(args);
let key = '';

for (let i = 0, len = keys.length; i < len; i++) {
key = keys[i];
if (!reservedKeys[key]) data[key] = args[key];
}

return this.post.create(data, args.r || args.replace).then(post => {
this.log.info('Created: %s', chalk.magenta(tildify(post.path)));
});
}
