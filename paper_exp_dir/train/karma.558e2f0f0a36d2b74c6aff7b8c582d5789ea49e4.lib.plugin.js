'use strict'

const fs = require('graceful-fs')
const path = require('path')
const helper = require('./helper')

const log = require('./logger').create('plugin')

const IGNORED_PACKAGES = ['karma-cli', 'karma-runner.github.com']

function resolve (plugins, emitter) {
const modules = []
