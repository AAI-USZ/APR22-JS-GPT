/**
* See {% crosslink util.yfm/parse %}.
*
* @method yfm
* @param {String} str
* @return {Object}
* @for util
* @static
*/

/**
* YAML front-matter parser.
*
* @class yfm
* @namespace util
* @module hexo
* @static
*/

var _ = require('lodash'),
  yaml = require('yamljs'),
  moment = require('moment'),
  escape = require('./escape').yaml;

var rYFM = /^(?:-{3,}\s*\n+)?([\s\S]+?)(?:\n+-{3,})(?:\s*\n+([\s\S]*))?/;

exports = module.exports = function(str){
  return parse(str);
};

/**
* Splits a YAML front-matter string.
*
* @method split
* @param {String} str
* @return {Object}
* @static
* @private
*/
var split = exports.split = function(str){
  if (!rYFM.test(str)){
    return {content: str};
  }

  var match = str.match(rYFM),
    data = match[1],
    content = match[2] || '';

  return {data: data, content: content};
};

/**
* Parses YAML front-matter.
*
* @method parse
* @param {String} str
* @return {Object}
* @static
*/

var parse = exports.parse = function(str){
  var splitData = split(str),
    raw = splitData.data,
    content = splitData.content;

  if (!raw) return {_content: str};

  try {
    var data = yaml.parse(escape(raw));

    if (typeof data === 'object'){
      return _.extend(data, {_content: content});
    } else {
      return {_content: str};
    }
  } catch (e){
    return {_content: str};
  }
};

/**
* Converts the object to YAML front-matter string.
*
* @method stringify
* @param {Object} data
* @return {String}
* @static
*/

exports.stringify = function(obj){
  var data = _.omit(obj, '_content'),
    content = obj._content || '',
    keys = Object.keys(data);

  if (keys.length){
    var nullKeys = [],
      dates = {},
      i,
      len,
      key;

    for (i = 0, len = keys.length; i < len; i++){
      key = keys[i];

      if (data[key] == null){
        nullKeys.push(key);
        delete data[key];
      } else if (data[key] instanceof Date){
        dates[key] = moment(data[key]);
        delete data[key];
      } else if (moment.isMoment(data[key])){
        dates[key] = data[key];
        delete data[key];
      }
    }

    var result = yaml.stringify(data).replace(/\s+$/, '') + '\n';

    for (i in dates){
      result += i + ': ' + dates[i].format('YYYY-MM-DD HH:mm:ss') + '\n';
    }

    for (i = 0, len = nullKeys.length; i < len; i++){
      result += nullKeys[i] + ':\n';
    }

    result += '---\n' + content;

    return result;
  } else {
    return content;
  }
};