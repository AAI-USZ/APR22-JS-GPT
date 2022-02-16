var threshold = Number(new Date(Number(new Date) - ms))
this.store.each(function(session, sid){
if (session.lastAccess < threshold)
