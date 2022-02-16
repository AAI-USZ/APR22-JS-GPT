const keywords = page.keywords || (page.tags && page.tags.length ? page.tags : undefined) || config.keywords;
keywords.map(tag => {
return tag.name ? tag.name : tag;
