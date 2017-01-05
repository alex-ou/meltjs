import {noop, warn} from '../util/index'
import {parse} from './ast_parser'
import {generate} from './codegen'

export default function compile (template) {
  let ast = parse(template)
  // [variable declarations, statements]
  let codeSnippet = generate(ast)
  return createFunction(codeSnippet)
}

function createFunction (codeSnippet) {
  try {
    // eslint-disable-next-line no-new-func
    return new Function('',
        `;var p = this, _h = p._h, _s = p._s; with(this){return ${codeSnippet}};`
    )
  } catch (error) {
    warn(error)
    return noop
  }
}
