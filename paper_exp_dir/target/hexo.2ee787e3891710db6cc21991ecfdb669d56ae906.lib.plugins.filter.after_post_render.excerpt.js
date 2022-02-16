const rExcerpt = /<!--+\s*more\s*--+>/i;
const content = data.content;
data.content = content.replace(rExcerpt, (match, index) => {
