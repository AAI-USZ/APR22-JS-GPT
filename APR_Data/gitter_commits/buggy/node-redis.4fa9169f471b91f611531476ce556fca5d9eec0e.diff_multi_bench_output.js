#!/usr/bin/env node

'use strict';

/* jshint -W079: Ignore redefinitions (before & after) */

var fs = require('fs'),
    metrics = require('metrics'),

    // `node diff_multi_bench_output.js before.txt after.txt`
    before = process.argv[2],
    after = process.argv[3];

if (!before || !after) {
    console.log('Please supply two file arguments:');
    var n = __filename;
    n = n.substring(n.lastIndexOf('/', n.length));
    console.log('    ./' + n + ' multiBenchBefore.txt multiBenchAfter.txt');
    console.log('To generate multiBenchBefore.txt, run');
    console.log('    node multi_bench.js > multiBenchBefore.txt');
    console.log('Thank you for benchmarking responsibly.');
    return;
}

var before_lines = fs.readFileSync(before, 'utf8').split('\n'),
    after_lines = fs.readFileSync(after, 'utf8').split('\n');

console.log('Comparing before,', before.green, '(', before_lines.length,
    'lines)', 'to after,', after.green, '(', after_lines.length, 'lines)');

var total_ops = new metrics.Histogram.createUniformHistogram();

function is_whitespace(s) {
    return !!s.trim();
}

function parseInt10(s) {
    return parseInt(s, 10);
}

// green if greater than 0, red otherwise
function humanize_diff(num, unit) {
    unit = unit || "";
    if (num > 0) {
        return ('+' + num + unit).green;
    }
    return ('' + num + unit).red;
}

function command_name(words) {
    var line = words.join(' ');
    return line.substr(0, line.indexOf(','));
}

before_lines.forEach(function(b, i) {
    var a = after_lines[i];
    if (!a || !b || !b.trim() || !a.trim()) {
        // console.log('#ignored#', '>'+a+'<', '>'+b+'<');
        return;
    }

    var b_words = b.split(' ').filter(is_whitespace);
    var a_words = a.split(' ').filter(is_whitespace);

    var ops =
        [b_words, a_words]
        .map(function(words) {
            // console.log(words);
            return parseInt10(words.slice(-2, -1));
        }).filter(function(num) {
            var isNaN = !num && num !== 0;
            return !isNaN;
        });
    if (ops.length !== 2) return;

    var delta = ops[1] - ops[0];
    var pct = ((delta / ops[0]) * 100).toPrecision(3);

    total_ops.update(delta);

    delta = humanize_diff(delta);
    pct = humanize_diff(pct, '%');
    console.log(
        // name of test
        command_name(a_words) === command_name(b_words) ?
            command_name(a_words) + ':' :
            '404:',
        // results of test
        ops.join(' -> '), 'ops/sec (∆', delta, pct, ')');
});

console.log('Mean difference in ops/sec:', humanize_diff(total_ops.mean().toPrecision(6)));
