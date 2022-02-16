'use strict';


function Source(ctx) {
Box.call(this, ctx, ctx.source_dir);

this.processors = ctx.extend.processor.list();
}

util.inherits(Source, Box);

module.exports = Source;
