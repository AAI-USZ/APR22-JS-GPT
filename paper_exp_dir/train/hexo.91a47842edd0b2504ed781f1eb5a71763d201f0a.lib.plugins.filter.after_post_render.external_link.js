'use strict';

const { URL } = require('url');

const urlObj = (str) => {
try {
return new URL(str);
} catch (err) {
return str;
}
};

const isExternal = (url, config) => {
