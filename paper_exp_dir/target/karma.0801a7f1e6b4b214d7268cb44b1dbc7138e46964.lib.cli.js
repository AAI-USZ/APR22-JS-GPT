if (name.indexOf('_') !== -1) {
throw new Error('Bad argument: ' + name + ' did you mean ' + name.replace('_', '-'))
}
