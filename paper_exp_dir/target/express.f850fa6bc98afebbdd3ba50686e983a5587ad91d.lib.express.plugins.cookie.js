if (event.response.cookies &&
event.response.cookies.length)
event.request.header('set-cookie', event.response.cookies.join(', '))
