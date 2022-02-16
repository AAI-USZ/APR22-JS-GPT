'use strict'

const path = require('path')
const { URL } = require('url')


class Url {
constructor (path, type) {
this.path = path
this.originalPath = path
this.type = type
this.isUrl = true
