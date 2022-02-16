var _ = require('lodash');

module.exports = function(options){
var options = _.extend({
base: root,
format: paginationDir + '/%d/',
total: this.total || 1,
current: this.current || 0,
prev_text: 'Prev',
next_text: 'Next',
