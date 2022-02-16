exports.process = function(file){
if (file.type === 'delete'){
file.box.config = {};
