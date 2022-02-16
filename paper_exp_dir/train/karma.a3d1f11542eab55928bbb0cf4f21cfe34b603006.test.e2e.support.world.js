const { spawn } = require('child_process')
const fs = require('fs')
const vm = require('vm')
const path = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const { setWorldConstructor } = require('cucumber')
const Proxy = require('./proxy')

class World {
