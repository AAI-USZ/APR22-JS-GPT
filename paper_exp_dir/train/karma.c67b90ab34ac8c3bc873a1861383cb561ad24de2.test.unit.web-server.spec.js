const EventEmitter = require('events').EventEmitter
const request = require('supertest')
const di = require('di')
const mocks = require('mocks')
const fs = require('fs')
const mime = require('mime')
const path = require('path')

describe('web-server', () => {
let server
let emitter
const File = require('../../lib/file')
