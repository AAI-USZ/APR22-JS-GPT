#!/usr/bin/env node



var cli = require("../lib/cli");
cli.execute(Array.prototype.slice.call(process.argv, 2));

