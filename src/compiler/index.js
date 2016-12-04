import {noop, warn} from '../util/index'
import {parse} from './ast_parser'
import {generate} from './codegen'

export default function compile (template) {
  let ast = parse(template)
  let code = generate(ast)
  let renderFn = createFunction(code)
  return renderFn
}

function createFunction (code) {
  console.log(code)
  try {
    // eslint-disable-next-line no-new-func
    return new Function('p',
        ';var _h = p._h, _s = p._s; with(this){return ' + code + '};'
    )
  } catch (error) {
    warn(error)
    return noop
  }
}
