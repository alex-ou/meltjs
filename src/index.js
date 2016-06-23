import createElement from './vdom/create'
import OpalApp from './app'

function Opal () {}
Opal.createElement = createElement
Opal.app = options => new OpalApp(options)

module.exports = Opal
