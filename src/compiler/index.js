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
    return new Function('$ctx',
        `;var _h = $ctx.createElement, _c = $ctx.renderCollection, range = $ctx.range;
        with($ctx.component){return ${codeSnippet}};`
    )
  } catch (error) {
    warn('Syntax error:' + codeSnippet)
    return noop
  }
}
