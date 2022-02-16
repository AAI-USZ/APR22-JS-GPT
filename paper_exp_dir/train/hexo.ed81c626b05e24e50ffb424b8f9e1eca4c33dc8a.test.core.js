var spawn = require('child_process').spawn,
async = require('async'),
util = require('../lib/util'),
file = util.file,
coreDir = __dirname + '/../';

var regex = {
post: /---\ntitle: (.*?)\ndate: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\ntags:(.*)?\n---\n[\s\S]*/,
page: /---\ntitle: (.*?)\ndate: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\n---\n[\s\S]*/,
normal: /---\nlayout: (.*?)\ntitle: (.*?)\ndate: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\ntags:(.*)?\n---\n[\s\S]*/,
};

describe('Core', function(){
describe('Initialize', function(){
it('init', function(done){
spawn('./bin/hexo', ['init', 'tmp']).on('exit', function(){
done();
