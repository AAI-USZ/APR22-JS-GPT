'use strict';

module.exports = ctx => {
const { config, log } = ctx;

log.info('Validating config');


if (typeof config.url !== 'string') {
throw new TypeError(`Invalid config detected: "url" should be string, not ${typeof config.url}!`);
}
try {

new URL(config.url);
} catch {
throw new TypeError('Invalid config detected: "url" should be a valid URL!');
}

if (typeof config.root !== 'string') {
throw new TypeError(`Invalid config detected: "root" should be string, not ${typeof config.root}!`);
}
if (config.root.trim().length <= 0) {
