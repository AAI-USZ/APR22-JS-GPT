// Based on: https://raw.github.com/imathis/octopress/master/plugins/code_block.rb

var extend = require('../../extend'),
  highlight = require('../../util').highlight,
  config = hexo.config,
  highlightConfig = config.highlight,
  lineNumConfig = highlightConfig ? highlightConfig.line_number : true,
  tabConfig = highlightConfig ? highlightConfig.tab_replace : '';

var regex = {
  captionUrlTitle: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
  captionUrl: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i,
  caption: /(\S[\S\s]*)/,
  lang: /\s*lang:(\w+)/i
};

var codeblock = function(args, content){
  var args = args.join(' ');

  var langPart = args.match(regex.lang);
  if (langPart){
    var lang = langPart[1];
    args = args.replace(/lang:\w+/i, '');
  } else {
    var lang = '';
  }

  var captionPart = args.match(regex.captionUrlTitle);
  if (captionPart){
    var caption = '<span>' + captionPart[1] + '</span><a href="' + captionPart[2] + captionPart[3] + '">' + captionPart[4] + '</a>';
  } else {
    var captionPart = args.match(regex.captionUrl);
    if (captionPart){
      var caption = '<span>' + captionPart[1] + '</span><a href="' + captionPart[2] + captionPart[3] + '">link</a>';
    } else {
      var captionPart = args.match(regex.caption);
      if (captionPart){
        var caption = '<span>' + captionPart[1] + '</span>';
      }
    }
  }

  return highlight(content, {lang: lang, caption: caption, gutter: lineNumConfig, tab: tabConfig});
};

extend.tag.register('code', codeblock, true);
extend.tag.register('codeblock', codeblock, true);