var swig = require('swig'),
  isReady = false;

module.exports = function(data, locales){
  if (!isReady) swig.init({tags: hexo.extend.swig.list()});

  return swig.compile(data.text)(locals);
};