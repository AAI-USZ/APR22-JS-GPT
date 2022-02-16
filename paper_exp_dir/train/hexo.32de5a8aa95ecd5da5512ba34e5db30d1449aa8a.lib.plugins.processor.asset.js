var common = require('./common');
var Promise = require('bluebird');
var yfm = require('hexo-front-matter');
var pathFn = require('path');

exports.process = function(file){
if (this.render.isRenderable(file.path)){
return processPage.call(this, file);
} else {
return processAsset.call(this, file);
}
};

