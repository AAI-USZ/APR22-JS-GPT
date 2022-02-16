require('core-js')
import {EventEmitter} from 'events'
import request from 'supertest-as-promised'
import di from 'di'
import mocks from 'mocks'
import fs from 'fs'
import mime from 'mime'
import path from 'path'

describe('web-server', () => {
var server
var emitter
var File = require('../../lib/file')

var _mocks = {}
var _globals = {__dirname: '/karma/lib'}

