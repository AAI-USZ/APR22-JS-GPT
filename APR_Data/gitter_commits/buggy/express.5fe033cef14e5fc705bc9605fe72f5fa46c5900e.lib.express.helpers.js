
// Express - Helpers - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * JSON aliases.
 */

JSON.encode = JSON.stringify
JSON.decode = JSON.parse

/**
 * Return the directory name of the given _path_.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.dirname = function(path) {
  return path.split('/').slice(0, -1).join('/')
}

/**
 * Return the extension name of the given _path_,
 * or null when not present.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.extname = function(path) {
  if (path.lastIndexOf('.') < 0) return
  return path.slice(path.lastIndexOf('.') + 1)
}

/**
 * Return the basename of the given _path_.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.basename = function(path) {
  return path.split('/').slice(-1)[0]
}

/**
 * Escape special characters in _html_.
 *
 * @param  {string} html
 * @return {string}
 * @api public
 */

exports.escape = function(html) {
  return html.toString()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Convert native array-like objects into an
 * array with optional _offset_.
 *
 * @param  {object} arr
 * @param  {int} offset
 * @return {array}
 * @api public
 */

exports.toArray = function(arr, offset) {
  return Array.prototype.slice.call(arr, offset)
}

/**
 * Escape RegExp _chars_ in _string_. Where _chars_ 
 * defaults to regular expression special characters.
 *
 * _chars_ should be a space delimited list of characters,
 * for example '[ ] ( )'.
 *
 * @param  {string} string
 * @param  {string} chars
 * @return {Type}
 * @api public
 */

exports.escapeRegexp = function(string, chars) {
  var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
  return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
}

/**
 * Merge param _key_ and _val_ into _params_. Key
 * should be a query string key such as 'user[name]',
 * and _val_ is it's associated value. The root _params_
 * object is returned.
 *
 * This is primarily used by Express for merging multi-part
 * body values together.
 *
 * @param  {string} key
 * @param  {string} val
 * @return {hash}
 * @api public
 */

exports.mergeParam = function(key, val, params) {
  var keys = key.match(/(\w+)/g),
      orig = params
  for (var i = 0, len = keys.length; i < len; ++i)
    if (i == len - 1)
      params[keys[i]] = val
    else
      params = (params[keys[i]] = params[keys[i]] || {})
  return orig
}