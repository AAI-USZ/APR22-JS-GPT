
// Express - Profiler - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.Profiler = Plugin.extend({
  on: {
    request: function(event) {
      this.start = Number(new Date)  
    },
    
    response: function(event) {
      puts(Number(new Date) - this.start + ' ms')
    }
  }
})