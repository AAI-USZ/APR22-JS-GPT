module.exports = function(data, callback){
if (!hexo.config.external_link) return callback();
callback(null, data);
