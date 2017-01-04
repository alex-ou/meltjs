import createElement, {registerComponent, registerContainer} from './web/component'
import createApp from './app'

function Melt (options) {
  return createApp(options)
}

Melt.createElement = createElement
Melt.component = registerComponent
Melt.container = registerContainer
Melt.app = Melt

module.exports = Melt
