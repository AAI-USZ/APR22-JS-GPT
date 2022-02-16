var pathFn = require('path');

function jsHelper(){
  var result = '';
  var path = '';

  for (var i = 0, len = arguments.length; i < len; i++){
    path = arguments[i];

    if (Array.isArray(path)){
      result += jsHelper.apply(this, path);
    } else {
      if (pathFn.extname(path) !== '.js') path += '.js';
      result += '<script src="' + this.url_for(path) + '" type="text/javascript"></script>\n';
    }
  }

  return result;
}

module.exports = jsHelper;