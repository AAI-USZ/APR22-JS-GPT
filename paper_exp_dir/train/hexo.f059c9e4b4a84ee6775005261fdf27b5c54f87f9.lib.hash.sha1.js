'use strict';

var Stream = require('stream');
var Transform = Stream.Transform;
var crypto = require('crypto');

var ALGORITHM = 'sha1';
var ENCODING = 'hex';

function Sha1Stream() {
Transform.call(this, {
objectMode: true
});

this._hash = crypto.createHash(ALGORITHM);
}

require('util').inherits(Sha1Stream, Transform);

Sha1Stream.prototype._transform = function(chunk, enc, callback) {
var buffer = chunk instanceof Buffer ? chunk : new Buffer(chunk, enc);
