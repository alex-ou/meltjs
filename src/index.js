import createElement from './vdom/create'
import OpalApp from './app'

export default function Opal () {}
Opal.createElement = createElement
Opal.app = options => new OpalApp(options)

