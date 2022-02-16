import Promise from 'bluebird'
import {EventEmitter} from 'events'
import mocks from 'mocks'
import proxyquire from 'proxyquire'
import pathLib from 'path'
var helper = require('../../lib/helper')
var _ = helper._

var from = require('core-js/library/fn/array/from')
var config = require('../../lib/config')


var patterns = (...strings) => strings.map(str => new config.Pattern(str))

function pathsFrom (files) {
return _.pluck(from(files), 'path')
}

function findFile (path, files) {
return from(files).find(file => file.path === path)
}

var PATTERN_LIST = {
'/some/*.js': ['/some/a.js', '/some/b.js'],
'*.txt': ['/c.txt', '/a.txt', '/b.txt'],
'/a.*': ['/a.txt']
}

var MG = {
statCache: {
'/some/a.js': {mtime: new Date()},
'/some/b.js': {mtime: new Date()},
'/a.txt': {mtime: new Date()},
'/b.txt': {mtime: new Date()},
'/c.txt': {mtime: new Date()}
}
}
var mockFs = mocks.fs.create({
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
