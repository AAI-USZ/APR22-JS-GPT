var posts = locals.posts.sort('date', -1).populate('categories').populate('tags');
