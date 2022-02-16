const babel = require('babel-core')

module.exports = function (wallaby) {
return {
files: [
{
pattern: 'package.json',
instrument: false
},
{
