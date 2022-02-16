module.exports = function(data, callback){
if (!config || !config.enable) return callback();
callback(null, data);
