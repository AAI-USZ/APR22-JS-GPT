function numberFormatHelper(num, options = {}) {
const split = num.toString().split('.');
let before = split.shift();
