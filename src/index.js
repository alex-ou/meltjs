import createElement from './vdom/create'
import createApp from './app'

function Opal () {}
Opal.createElement = createElement
Opal.app = options => createApp(options)

module.exports = Opal
