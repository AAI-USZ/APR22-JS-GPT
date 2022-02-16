'use strict';

var util   = require("util");

function Packet(type, size) {
this.type = type;
this.size = +size;
}

function ReplyParser(return_buffers) {
this.name = exports.name;
this.return_buffers = return_buffers;

this._buffer            = null;
this._offset            = 0;
this._encoding          = "utf-8";
}

function IncompleteReadBuffer(message) {
this.name = "IncompleteReadBuffer";
this.message = message;
}
util.inherits(IncompleteReadBuffer, Error);

ReplyParser.prototype._parseResult = function (type) {
var start, end, offset, packetHeader;

if (type === 43 || type === 45) {

end = this._packetEndOffset() - 1;
start = this._offset;

if (end > this._buffer.length) {
throw new IncompleteReadBuffer("Wait for more data.");
}


this._offset = end + 2;

if (type === 45) {
return new Error(this._buffer.toString(this._encoding, start, end));
} else if (this.return_buffers) {
