var extend = require('../../extend'),
  format = require('util').format;

var regex = {
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/,
  meta: /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/
};

var img = function(args, content){
  var classes = [],
    src = '';

  for (var i=0, len=args.length; i<len; i++){
    var item = args[i];

    if (!item.match(regex.url)){
      if (item.substr(0, 1) === '/'){
        src = item;
        args = args.slice(i + 1);
        break;
      } else {
        classes.push(item);
      }
    } else {
      src = item;
      args = args.slice(i + 1);
      break;
    }
  }

  if (args.length){
    if (args[0].match(/\D+/)){
      var meta = args.join(' ');
    } else {
      var width = args.shift();
      if (args.length){
        if (args[0].match(/\D+/)){
          var meta = args.join(' ');
        } else {
          var height = args.shift(),
            meta = args.join(' ');
        }
      }
    }
  }

  if (meta){
    var metaMatch = meta.match(regex.meta);
    if (metaMatch){
      var title = metaMatch[1],
        alt = metaMatch[2];
    }
  }

  // src, class, width, height, title, alt
  return format('<img src="%s"%s%s%s%s%s>', src, (classes.length ? ' class="' + classes.join(' ') + '"' : ''), (width ? ' width="' + width + '"' : ''), (height ? ' height="' + height + '"' : ''), (title ? ' title="' + title + '"' : ''), (alt ? ' alt="' + alt + '"' : ''));
};

extend.tag.register('img', img);
extend.tag.register('image', img);