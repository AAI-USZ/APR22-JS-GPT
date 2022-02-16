var hljs = require('highlight.js'),
  _ = require('lodash');

var alias = {
  js: 'javascript',
  jscript: 'javascript',
  html: 'xml',
  htm: 'xml',
  coffee: 'coffeescript',
  yml: 'yaml',
  pl: 'perl',
  ru: 'ruby',
  rb: 'ruby'
};

var keys = Object.keys(alias);

var defaults = {
  gutter: true,
  first_line: 1,
  lang: '',
  caption: '',
  tab: ''
};

module.exports = function(raw, options){
  var options = _.extend(defaults, options);

  if (options.tab){
    raw = raw.replace(/\n(\t+)/g, function(match, tabs){
      var result = '\n';

      for (var i=0, len=tabs.length; i<len; i++){
        result += options.tab;
      }

      return result;
    });
  }

  if (!options.lang){
    var compiled = hljs.highlightAuto(raw).value;
  } else if (options.lang === 'plain'){
    var compiled = raw;
  } else {
    var lang = options.lang.toLowerCase();

    if (keys.indexOf(lang) !== -1) lang = alias[lang];

    try {
      var compiled = hljs.highlight(lang, raw).value;
    } catch (e){
      var compiled = hljs.highlightAuto(raw).value;
    }
  }

  var lines = compiled.split('\n'),
    numbers = '',
    content = '',
    firstLine = options.first_line;

  lines.forEach(function(item, i){
    numbers += (i + firstLine) + '\n';
    content += item + '\n';
  });

  if (options.gutter){
    var result = '<figure class="highlight' + (options.lang ? ' lang-' + options.lang : '') + '">'+
      (options.caption ? '<figcaption>' + options.caption + '</figcaption>' : '') +
      '<table>'+
      '<tr>'+
      '<td class="gutter"><pre>' + numbers + '</pre></td>'+
      '<td class="code"><pre>' + content + '</pre></td>'+
      '</tr>'+
      '</table>'+
      '</figure>';
  } else {
    var result = content;
  }

  return result;
};