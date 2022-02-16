'use strict'

class EmitterWrapper {
constructor (emitter) {
this.listeners = {}
this.emitter = emitter
}

addListener (event, listener) {
this.emitter.addListener(event, listener)

