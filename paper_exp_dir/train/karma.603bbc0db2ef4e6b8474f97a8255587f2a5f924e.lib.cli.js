'use strict'

const path = require('path')
const yargs = require('yargs')
const fs = require('graceful-fs')

const Server = require('./server')
const helper = require('./helper')
const constant = require('./constants')

function processArgs (argv, options, fs, path) {
Object.getOwnPropertyNames(argv).forEach(function (name) {
let argumentValue = argv[name]
