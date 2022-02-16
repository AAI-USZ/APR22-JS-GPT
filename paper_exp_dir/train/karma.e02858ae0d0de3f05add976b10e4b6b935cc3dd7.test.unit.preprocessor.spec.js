'use strict'

const mocks = require('mocks')
const path = require('path')

describe('preprocessor', () => {
let m
let mockFs

const binarydata = Buffer.from([0x25, 0x50, 0x44, 0x66, 0x46, 0x00])


let fakePreprocessor
