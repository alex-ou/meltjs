import {noop, warn} from '../util/index'
import {parse} from './ast_parser'
import {generate} from './codegen'

export default function compile (template) {
  let ast = parse(template)
  // [variable declarations, statements]
  let codeSnippets = generate(ast)
  return createFunction(codeSnippets)
}

function createFunction (codeSnippets) {
  console.log(codeSnippets[0])
  console.log(codeSnippets[1])
  try {
    // eslint-disable-next-line no-new-func
    return new Function('p',
        `;var _h = p._h, _s = p._s; with(this){${codeSnippets[0]} return ${codeSnippets[1]}};`
    )
  } catch (error) {
    warn(error)
    return noop
  }
}
