


var config = hexo.config;

module.exports = function(data, callback){
if (!config.auto_spacing) return callback();




data.content = data.content

.replace(/([\u4e00-\u9fa5\u3040-\u30FF])([a-z0-9@#&;=_\[\$\%\^\*\-\+\(\/])/ig, '$1 $2')
