var hljs = require('highlight.js');

module.exports = function(code, lang, caption){
  if (lang){
    var lang = lang.toLowerCase();

    switch (lang){
      case 'js':
        lang = 'javascript';
        break;

      case 'html':
        lang = 'xml';
        break;

      case 'yml':
        lang = 'yaml';
        break;

      case 'pl':
        lang = 'perl';
        break;

      case 'ru':
        lang = 'ruby';
        break;
    }

    try {
      var compiled = hljs.highlight(lang, code).value;
    } catch (e){
      var compiled = hljs.highlightAuto(code).value;
    }
  } else {
    var compiled = hljs.highlightAuto(code).value;
  }

  var lines = compiled.split('\n'),
    numbers = '',
    code = '',
    current = 1;

  for (var i=0, len=lines.length; i<len; i++){
    var line = lines[i];
    numbers += '<div class="line-number">' + current + '</div>';
    code += line ? '<div class="line">' + line + '</div>' : '<br>';
    current++;
  }

  var result = '<figure class="highlight">'+
    (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
    '<table>'+
    '<tr>'+
    '<td class="gutter"><pre>' + numbers + '</pre></td>'+
    '<td class="code"><pre>' + code + '</pre></td>'+
    '</tr>'+
    '</table>'+
    '</figure>';

  return result;
};