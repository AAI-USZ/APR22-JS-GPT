'use strict'

const Promise = require('bluebird')
const EventEmitter = require('events').EventEmitter
const mocks = require('mocks')
const proxyquire = require('proxyquire')
const pathLib = require('path')
const _ = require('lodash')

const helper = require('../../lib/helper')
const config = require('../../lib/config')


function patterns () {
return Array.from(arguments).map((str) => new config.Pattern(str))
}

function pathsFrom (files) {
return Array.from(files).map((file) => file.path)
}

function findFile (path, files) {
return Array.from(files).find((file) => file.path === path)
}

const PATTERN_LIST = {
'/some/*.js': ['/some/a.js', '/some/b.js'],
'*.txt': ['/c.txt', '/a.txt', '/b.txt'],
'/a.*': ['/a.txt']
}

const MG = {
statCache: {
'/some/a.js': { mtime: new Date() },
'/some/b.js': { mtime: new Date() },
'/a.txt': { mtime: new Date() },
'/b.txt': { mtime: new Date() },
'/c.txt': { mtime: new Date() }
}
}
const mockFs = mocks.fs.create({
some: {
'0.js': mocks.fs.file('2012-04-04'),
'a.js': mocks.fs.file('2012-04-04'),
'b.js': mocks.fs.file('2012-05-05'),
'd.js': mocks.fs.file('2012-05-05')
},
folder: {
'x.js': mocks.fs.file(0)
},
'a.txt': mocks.fs.file(0),
'b.txt': mocks.fs.file(0),
'c.txt': mocks.fs.file(0),
'a.js': mocks.fs.file('2012-01-01')
})

describe('FileList', () => {
let list
let emitter
let preprocess
let patternList
let mg
let modified
let glob
let List = list = emitter = preprocess = patternList = mg = modified = glob = null

beforeEach(() => {
preprocess = sinon.stub().resolves()
})

describe('files', () => {
beforeEach(() => {
patternList = PATTERN_LIST
mg = MG
emitter = new EventEmitter()

