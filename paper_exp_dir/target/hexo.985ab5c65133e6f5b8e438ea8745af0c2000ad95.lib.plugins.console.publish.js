return this.post.publish({
slug: args._.pop(),
layout: args._.length ? args._[0] : this.config.default_layout
