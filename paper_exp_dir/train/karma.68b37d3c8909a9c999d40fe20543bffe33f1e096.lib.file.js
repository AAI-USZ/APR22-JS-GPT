'use strict'


class File {
constructor (path, mtime, doNotCache, type) {

this.path = path


this.originalPath = path


this.contentPath = path



this.encodings = Object.create(null)

this.mtime = mtime
this.isUrl = false

this.doNotCache = doNotCache === undefined ? false : doNotCache

this.type = type
