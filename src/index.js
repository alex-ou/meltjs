import createElement from './web/component'
import {registerComponent, registerContainer} from './web/component_registry'
import createApp from './app'

function Melt (options) {
  return createApp(options)
}

Melt.createElement = createElement
Melt.component = registerComponent
Melt.container = registerContainer
Melt.app = Melt

module.exports = Melt
