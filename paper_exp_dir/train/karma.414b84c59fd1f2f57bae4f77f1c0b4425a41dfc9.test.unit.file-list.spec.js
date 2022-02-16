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
'/some/a.js': {mtime: new Date()},
'/some/b.js': {mtime: new Date()},
'/a.txt': {mtime: new Date()},
'/b.txt': {mtime: new Date()},
'/c.txt': {mtime: new Date()}
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

beforeEach(() => {})

describe('files', () => {
beforeEach(() => {
patternList = PATTERN_LIST
mg = MG
preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()

glob = {
Glob: function (pattern, opts) {
return {
found: patternList[pattern],
statCache: mg.statCache
}
}
}

List = proxyquire('../../lib/file-list', {
helper: helper,
glob: glob,
path: pathLib.posix,
'graceful-fs': mockFs
})
})

it('returns a flat array of served files', () => {
list = new List(patterns('/some/*.js'), [], emitter, preprocess)

return list.refresh().then(() => {
expect(list.files.served).to.have.length(2)
})
})

it('returns a unique set', () => {
list = new List(patterns('/a.*', '*.txt'), [], emitter, preprocess)

return list.refresh().then(() => {
expect(list.files.served).to.have.length(3)
expect(pathsFrom(list.files.served)).to.contain('/a.txt', '/b.txt', '/c.txt')
})
})

it('returns only served files', () => {
const files = [
new config.Pattern('/a.*', true),
new config.Pattern('/some/*.js', false)
]

list = new List(files, [], emitter, preprocess)

return list.refresh().then(() => {
expect(pathsFrom(list.files.served)).to.eql(['/a.txt'])
})
})

it('marks no cache files', () => {
const files = [
new config.Pattern('/a.*'),
new config.Pattern('/some/*.js', true, true, true, true)
]

list = new List(files, [], emitter, preprocess)

return list.refresh().then(() => {
expect(pathsFrom(list.files.served)).to.deep.equal([
'/a.txt',
'/some/a.js',
'/some/b.js'
])
expect(preprocess).to.have.been.calledOnce
expect(list.files.served[0].doNotCache).to.be.false
expect(list.files.served[1].doNotCache).to.be.true
expect(list.files.served[2].doNotCache).to.be.true
})
})

it('returns a flat array of included files', () => {
const files = [
new config.Pattern('/a.*', true, false),
new config.Pattern('/some/*.js')
]

list = new List(files, [], emitter, preprocess)

return list.refresh().then(() => {
expect(pathsFrom(list.files.included)).not.to.contain('/a.txt')
expect(pathsFrom(list.files.included)).to.deep.equal([
'/some/a.js',
'/some/b.js'
])
})
})
})

describe('_findExcluded', () => {
beforeEach(() => {
preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()
})

it('returns undefined when no match is found', () => {
list = new List([], ['hello.js', 'world.js'], emitter, preprocess)
expect(list._findExcluded('hello.txt')).to.be.undefined
expect(list._findExcluded('/hello/world/i.js')).to.be.undefined
})

it('returns the first match if it finds one', () => {
list = new List([], ['*.js', '**/*.js'], emitter, preprocess)
expect(list._findExcluded('world.js')).to.be.eql('*.js')
expect(list._findExcluded('/hello/world/i.js')).to.be.eql('**/*.js')
})
})

describe('_findIncluded', () => {
