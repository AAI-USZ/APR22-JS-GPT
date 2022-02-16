class Theme {
constructor(ctx) {
Reflect.apply(Box, this, [ctx, ctx.theme_dir]);
