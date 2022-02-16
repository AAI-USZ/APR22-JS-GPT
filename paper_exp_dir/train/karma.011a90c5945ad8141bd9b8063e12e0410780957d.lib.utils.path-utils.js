'use strict'

const path = require('path')

const PathUtils = {
formatPathMapping (path, line, column) {
return path + (line ? `:${line}` : '') + (column ? `:${column}` : '')
},

