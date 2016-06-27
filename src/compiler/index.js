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
  try {
    // eslint-disable-next-line no-new-func
    return new Function('_h', 'with(this){return ' + code + '}')
  } catch (error) {
    warn(error)
    return noop
  }
}
