
// Express - Logger - Copyright Aaron Heckmann <aaronheckmann+express@gmail.com> (MIT Licensed)

/**
 * Log formats
 */
 
var formats = {
  common: function (event) {
    return [event.request.connection.remoteAddress, 
          '-', 
          '-',
          '[' + formatDate(new Date) + ']', 
          '"' + event.request.method.toUpperCase() + ' ' + (event.request.url.pathname || '/') + 
          ' HTTP/' + event.request.httpVersion + '"',
          event.request.response.status,
          event.request.response.headers['content-length'] || 0
          ].join(' ')
  },
  combined: function (event) {
    return [formats.common(event),
          '"' + (event.request.headers['referrer'] || event.request.headers['referer'] || '-') + '"',
          '"' + (event.request.headers['user-agent'] || '') + '"'
          ].join(' ')
  },
  sinatra: function (event, start) {
    return formats.common(event) + " " + ((Number(new Date) - start)/1000).toFixed(3)
  },
  plot: function (event, start) {
    return Number(new Date) - start
  }
}


/**
 * Months.
 */

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Format _date_.
 *
 * @param  {Date} date
 * @return {string}
 * @api private
 */
 
function formatDate(date) {
  var d = date.getDate(),
      m = months[date.getMonth()],
      y = date.getFullYear(),
      h = date.getHours(),
      mi = date.getMinutes(),
      s = date.getSeconds()
  return (d < 10 ? '0' : '') + d + '/' + m + '/' + y + ' ' +
         (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + 
         mi + ':' + (s < 10 ? '0' : '') + s
}


// --- Logger

exports.Logger = Plugin.extend({ 
  extend: {
    
    /**
     * Initialize logger options.
     *
     * Options:
     *
     *   - format
     *       'common' outputs log in CommonLog format (DEFAULT)
     *       'combined' outputs log in Apache Combined format
     *       'sinatra' outputs log in Sinatra format
     *       'plot' outputs request duration in milliseconds only
     *
     * @param  {hash} options
     * @api private
     */

    init: function(options) {
      this.merge(options || {})
    }
  },
  
  on: {
    
    /**
     * Start timer.
     */
    
    request: function(event) {
      this.start = Number(new Date)
    },
    
    /**
     * Output log data.
     */
    
    response: function(event) {
      puts((formats[exports.Logger.format] || formats["common"])(event, this.start))
    }
  }
})