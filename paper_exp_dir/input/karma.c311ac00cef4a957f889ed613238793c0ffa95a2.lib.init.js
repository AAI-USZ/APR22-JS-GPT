'use strict'

const readline = require('readline')
const path = require('path')
const glob = require('glob')
const mm = require('minimatch')
const exec = require('child_process').exec

const helper = require('./helper')
const logger = require('./logger')

const log = logger.create('init')
const logQueue = require('./init/log-queue')

const StateMachine = require('./init/state_machine')
const COLOR_SCHEME = require('./init/color_schemes')
const formatters = require('./init/formatters')






let NODE_MODULES_DIR = path.resolve(__dirname, '../..')



if (!/node_modules$/.test(NODE_MODULES_DIR)) {
NODE_MODULES_DIR = path.resolve('node_modules')
}

function installPackage (pkgName) {

try {
require(NODE_MODULES_DIR + '/' + pkgName)
return
} catch (e) {}


const options = {
cwd: path.resolve(NODE_MODULES_DIR, '..')
}



logQueue.push(function () {
if (!err) {
