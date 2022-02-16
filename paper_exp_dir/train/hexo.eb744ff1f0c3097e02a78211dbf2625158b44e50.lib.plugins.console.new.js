'use strict';

const tildify = require('tildify');
const chalk = require('chalk');

const reservedKeys = {
_: true,
title: true,
layout: true,
slug: true,
s: true,
path: true,
p: true,
replace: true,
r: true,

config: true,
debug: true,
safe: true,
silent: true
