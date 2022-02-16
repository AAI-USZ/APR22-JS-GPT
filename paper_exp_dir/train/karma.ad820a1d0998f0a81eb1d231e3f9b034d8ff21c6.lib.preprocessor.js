'use strict'

const fs = require('graceful-fs')
const mm = require('minimatch')
const isBinaryFile = require('isbinaryfile')
const combineLists = require('combine-lists')
const CryptoUtils = require('./utils/crypto-utils')

const log = require('./logger').create('preprocess')

function createNextProcessor (preprocessors, file, done) {
