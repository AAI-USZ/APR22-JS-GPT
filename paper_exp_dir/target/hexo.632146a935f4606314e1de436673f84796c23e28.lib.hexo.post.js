const _escapeContent = (cache, str) => {
const placeholder = '\uFFFC';
return `<!--${placeholder}${cache.push(str) - 1}-->`;
