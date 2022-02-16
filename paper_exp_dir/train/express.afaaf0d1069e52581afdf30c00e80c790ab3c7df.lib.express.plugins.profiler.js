


function usage(label, stats) {
puts(label)
puts('  rss        : ' + stats.rss)
puts('  vsize      : ' + stats.vsize)
puts('  heap total : ' + stats.heapTotal)
puts('  heap used  : ' + stats.heapUsed)
}

exports.Profiler = Plugin.extend({
on: {
