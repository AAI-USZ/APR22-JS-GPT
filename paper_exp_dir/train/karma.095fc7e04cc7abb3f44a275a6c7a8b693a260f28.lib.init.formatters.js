'use strict'

const path = require('path')
const FileUtils = require('../utils/file-utils')

function quote (value) {
return `'${value}'`
}

function formatLine (items) {
