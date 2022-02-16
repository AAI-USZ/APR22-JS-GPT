'use strict'

const path = require('path')
const assert = require('assert')
const optimist = require('optimist')
const fs = require('graceful-fs')

const Server = require('./server')
const helper = require('./helper')
const constant = require('./constants')

function processArgs (argv, options, fs, path) {
if (argv.help) {
