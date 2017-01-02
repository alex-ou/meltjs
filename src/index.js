import createElement, {registerComponent} from './web/component'
import createApp from './app'

function Melt () {}
Melt.createElement = createElement
Melt.component = registerComponent
Melt.app = options => createApp(options)

module.exports = Melt
