var yml = function(file, content){
return yaml.parse(content);
extend.renderer.register('yml', yml, true);
