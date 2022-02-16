'use strict'

const fs = require('graceful-fs')
const path = require('path')
const _ = require('lodash')
const useragent = require('useragent')
const Promise = require('bluebird')
const mm = require('minimatch')

exports.browserFullNameToShort = (fullName) => {
