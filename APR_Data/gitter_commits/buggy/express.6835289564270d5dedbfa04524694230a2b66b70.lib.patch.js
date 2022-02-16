/*!
 * Connect
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http');
var ServerResponse = http.ServerResponse;

// apply only once
if (ServerResponse.prototype._hasConnectPatch) {
  return;
}

// original methods
var setHeader = ServerResponse.prototype.setHeader;
var writeHead = ServerResponse.prototype.writeHead;

/**
 * Provide a public "header sent" flag
 * until node does.
 *
 * @return {Boolean}
 * @api public
 */

ServerResponse.prototype.__defineGetter__('headerSent', function(){
  return this._header;
});

/**
 * Set header `field` to `val`, special-casing
 * the `Set-Cookie` field for multiple support.
 *
 * @param {String} field
 * @param {String} val
 * @api public
 */

ServerResponse.prototype.setHeader = function(field, val){
  var key = field.toLowerCase()
    , prev;

  // special-case Set-Cookie
  if (this._headers && 'set-cookie' == key) {
    if (prev = this.getHeader(field)) {
        if (Array.isArray(prev)) {
            val = prev.concat(val);
        } else if (Array.isArray(val)) {
            val = val.concat(prev);
        } else {
            val = [prev, val];
        }
    }
  // charset
  } else if ('content-type' == key && this.charset) {
    val += '; charset=' + this.charset;
  }

  return setHeader.call(this, field, val);
};

ServerResponse.prototype.writeHead = function(statusCode, reasonPhrase, headers){
  if (typeof reasonPhrase === 'object') headers = reasonPhrase;
  if (typeof headers === 'object') {
    Object.keys(headers).forEach(function(key){
      this.setHeader(key, headers[key]);
    }, this);
  }
  if (!this._emittedHeader) this.emit('header');
  this._emittedHeader = true;
  return writeHead.call(this, statusCode, reasonPhrase);
};

ServerResponse.prototype._hasConnectPatch = true;
