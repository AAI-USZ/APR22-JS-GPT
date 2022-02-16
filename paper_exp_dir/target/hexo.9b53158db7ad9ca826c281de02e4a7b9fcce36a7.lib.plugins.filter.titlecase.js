module.exports = function(data, callback){
if (!hexo.config.titlecase) return callback();
callback(null, data);
