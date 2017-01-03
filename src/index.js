import createElement, {registerComponent} from './web/component'
import createApp from './app'

function Melt (options) {
  return createApp(options)
}

Melt.createElement = createElement
Melt.component = registerComponent
Melt.app = Melt

module.exports = Melt
