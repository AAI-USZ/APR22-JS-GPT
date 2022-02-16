var filename = item.substring(0, item.length - extname.length),
fileext = path.extname(filename),
dest = filename + '.' + (fileext ? fileext : output);
