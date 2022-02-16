while (args.length > 0) {
const item = args.shift();
if (rUrl.test(item) || item[0] === '/') {
