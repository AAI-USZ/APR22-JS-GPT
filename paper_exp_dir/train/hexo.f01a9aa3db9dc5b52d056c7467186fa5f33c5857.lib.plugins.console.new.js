'use strict';

var tildify = require('tildify');
var chalk = require('chalk');

var reservedKeys = {
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

var data = {
title: args._.pop(),
layout: args._.length ? args._[0] : this.config.default_layout,
slug: args.s || args.slug,
path: args.p || args.path
