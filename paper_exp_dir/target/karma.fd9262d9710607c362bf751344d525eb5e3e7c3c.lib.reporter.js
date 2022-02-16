log.debug('Trying to load reporter: %s', name)
reporters.push(injector.createChild([locals], ['reporter:' + name]).get('reporter:' + name))
} catch (e) {
