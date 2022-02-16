var EventEmitter = require('events').EventEmitter
var request = require('supertest')
var di = require('di')
var mocks = require('mocks')
var fs = require('fs')
var mime = require('mime')
var path = require('path')

describe('web-server', () => {
var server
