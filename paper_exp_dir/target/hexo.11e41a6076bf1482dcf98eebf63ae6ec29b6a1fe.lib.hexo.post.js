data.slug = slugize(data.slug || data.title, {transform: config.filename_case});
var slug = data.slug = slugize(data.slug, {transform: config.filename_case});
function escapeContent(str){
