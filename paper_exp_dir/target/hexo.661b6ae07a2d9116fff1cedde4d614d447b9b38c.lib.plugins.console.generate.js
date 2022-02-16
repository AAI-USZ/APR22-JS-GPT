const publicFiles = Cache.filter(item => item._id.startsWith('public/')).map(item => item._id.substring(7));
Promise.filter(publicFiles, path => !routeList.includes(path)).map(deleteFile)
