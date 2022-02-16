module.exports = ctx => {
const processor = ctx.extend.processor;
const obj = require(`./${name}`)(ctx);
