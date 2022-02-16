'use strict';

const { EventEmitter } = require('events');
const Promise = require('bluebird');
const Stream = require('stream');
const { Readable } = Stream;

class RouteStream extends Readable {
constructor(data) {
super({ objectMode: true });

this._data = data.data;
this._ended = false;
this.modified = data.modified;
}
