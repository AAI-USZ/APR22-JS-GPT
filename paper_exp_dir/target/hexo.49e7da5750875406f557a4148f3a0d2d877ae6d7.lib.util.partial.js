newLocals.partial = function(part, options){
var result = render(partial, fs.readFileSync(partial, 'utf8'), _.extend(locals, options));
