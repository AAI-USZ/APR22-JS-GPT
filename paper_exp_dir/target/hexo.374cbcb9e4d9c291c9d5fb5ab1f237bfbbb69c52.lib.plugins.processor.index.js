} else {
dbTags.insert({name: tag, slug: escape(tagMap[tag] || tag), posts: [_id]}, function(tag){
tags.push(tag._id);
