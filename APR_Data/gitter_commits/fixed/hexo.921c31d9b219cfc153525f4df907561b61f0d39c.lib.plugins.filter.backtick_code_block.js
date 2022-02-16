// Backtick Code Block
// https://github.com/imathis/octopress/blob/master/plugins/backtick_code_block.rb

var extend = require('../../extend'),
  util = require('../../util'),
  highlight = util.highlight,
  config = hexo.config,
  highlightConfig = config.highlight,
  highlightEnable = highlightConfig.enable,
  backtickConfig = highlightConfig.backtick_code_block,
  lineNumConfig = highlightConfig.line_number,
  tabConfig = highlightConfig.tab_replace;

var regex = {
  allOptions: /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/i,
  langCaption: /([^\s]+)\s*(.+)?/i
};

extend.filter.register('pre', function(data){
  if (!highlightEnable) return;

  // https://github.com/chjj/marked/blob/master/lib/marked.js#L73
  data.content = data.content.replace(/ *(`{3,}|~{3,}) *([^\n]+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/g, function(match, tick, args, str){
    var options = {gutter: lineNumConfig, tab: tabConfig};
      indent = str.match(/^(\t*)/)[1].length,
      code = [];

    if (args){
      if (regex.allOptions.test(args)){
        var matched = args.match(regex.allOptions);
      } else if (regex.langCaption.test(args)){
        var matched = args.match(regex.langCaption);
      }

      options.lang = matched[1];

      if (matched[2]){
        options.caption = '<span>' + matched[2] + '</span>';

        if (matched[3]){
          options.caption += '<a href="' + matched[3] + '">' + (matched[4] ? matched[4] : 'link') + '</a>';
        }
      }
    }

    str.split('\n').forEach(function(line){
      if (indent){
        code.push(line.replace(new RegExp('^\\t{' + indent + '}'), ''));
      } else {
        code.push(line);
      }
    });

    return '<escape indent="' + indent + '">' + highlight(code.join('\n'), options).replace(/&amp;/g, '&') + '</escape>\n';
  });

  return data;
});