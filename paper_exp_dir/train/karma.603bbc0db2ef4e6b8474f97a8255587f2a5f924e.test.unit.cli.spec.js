'use strict'

const path = require('path')
const mocks = require('mocks')

const cli = require('../../lib/cli')
const constant = require('../../lib/constants')

const loadFile = mocks.loadFile

describe('cli', () => {
let m
