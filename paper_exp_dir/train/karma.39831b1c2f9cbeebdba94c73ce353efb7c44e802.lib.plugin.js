'use strict'

const fs = require('graceful-fs')
const path = require('path')
const helper = require('./helper')

const log = require('./logger').create('plugin')

const IGNORED_PACKAGES = ['karma-cli', 'karma-runner.github.com']

function resolve (plugins, emitter) {
const modules = []

function requirePlugin (name) {
log.debug(`Loading plugin ${name}.`)
try {
modules.push(require(name))
} catch (e) {
if (e.code === 'MODULE_NOT_FOUND' && e.message.includes(name)) {
log.error(`Cannot find plugin "${name}".\n  Did you forget to install it?\n  npm install ${name} --save-dev`)
} else {
log.error(`Error during loading "${name}" plugin:\n  ${e.message}`)
}
emitter.emit('load_error', 'plug_in', name)
}
}

plugins.forEach(function (plugin) {
if (helper.isString(plugin)) {
if (!plugin.includes('*')) {
requirePlugin(plugin)
return
}
const pluginDirectory = path.normalize(path.join(__dirname, '/../..'))
const regexp = new RegExp(`^${plugin.replace(/\*/g, '.*').replace(/\

log.debug(`Loading ${plugin} from ${pluginDirectory}`)
fs.readdirSync(pluginDirectory)
.map((e) => {
const modulePath = path.join(pluginDirectory, e)
if (e[0] === '@') {
return fs.readdirSync(modulePath).map((e) => path.join(modulePath, e))
}
return modulePath
})
.reduce((a, x) => a.concat(x), [])
.map((modulePath) => path.relative(pluginDirectory, modulePath))
