




var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']



function format(date) {
var d = date.getDate(),
m = months[date.getMonth()],
y = date.getFullYear(),
h = date.getHours(),
mi = date.getMinutes(),
s = date.getSeconds()
return (d < 10 ? '0' : '') + d + '/' + m + '/' + y + ' ' +
