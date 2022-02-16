'use strict'

const optimist = require('optimist')
const path = require('path')
const mocks = require('mocks')

const cli = require('../../lib/cli')
const constant = require('../../lib/constants')

const loadFile = mocks.loadFile

describe('cli', () => {
let m
let e
let mockery

const fsMock = mocks.fs.create({
