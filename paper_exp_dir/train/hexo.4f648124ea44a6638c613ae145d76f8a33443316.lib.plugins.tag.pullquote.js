
module.exports = function(ctx){
return function pullquoteTag(args, content){
var result = '';

args.unshift('pullquote');

result += '<blockquote class="' + args.join(' ') + '">';
result += ctx.render.renderSync({text: content, engine: 'markdown'});
result += '</blockquote>';

