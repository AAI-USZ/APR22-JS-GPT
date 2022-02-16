var rExcerpt = /<!-{2,} *more *-{2,}>/;

function excerptFilter(data){
var content = data.content;

if (rExcerpt.test(content)){
data.content = content.replace(rExcerpt, function(match, index){
data.excerpt = content.substring(0, index).trim();
data.more = content.substring(index + match.length).trim();
