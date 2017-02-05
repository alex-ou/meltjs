import createElement from './web/component'
import {registerComponent, registerContainer, registerDirective} from './web/index'
import createApp from './app'

function Melt (options) {
  return createApp(options)
}

Melt.createElement = createElement
Melt.component = registerComponent
Melt.container = registerContainer
Melt.directive = registerDirective
Melt.app = Melt

module.exports = Melt
