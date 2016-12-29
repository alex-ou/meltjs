import createElement, {registerComponent} from './web/component'
import createApp from './app'

function Opal () {}
Opal.createElement = createElement
Opal.component = registerComponent
Opal.app = options => createApp(options)

module.exports = Opal
