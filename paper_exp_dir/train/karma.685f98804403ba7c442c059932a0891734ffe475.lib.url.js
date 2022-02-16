'use strict'


class Url {
constructor (path, type) {
this.path = path
this.type = type
this.isUrl = true
}

toString () {
return this.path
