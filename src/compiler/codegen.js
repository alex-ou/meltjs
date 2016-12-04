import {AstElementType, AstTokenType} from './ast_type'

/**
 * Generate the code to create the virtual DOM given the AST
 * The generated code should be like below:
 * let node = h('div', { id: 'foo' }, [
 *   h('a', { href: 'http://google.com' },
 *     h('span', {}, 'Google'),
 *     h('b', {}, 'Link')
 *   )
 * ])
 * @param ast, the parsed AST
 */
export function generate (ast) {
  return genElement(ast)
}

function genElement (element) {
  // For element
  if (element.type === AstElementType.Element) {
    return (
      `_h("${element.tagName}",` + genAttributes(element) + ',' +
      genChildren(element) +
      ')'
    )
  }

  // For text
  return genText(element.tokens)
}

function genAttributes (element) {
  return JSON.stringify(element.attributes || {})
}

function genChildren (element) {
  if (!element.children) {
    return '[]'
  }

  let children = element.children
  let childrenCodeArray = children.map(genElement)
  return '[' + childrenCodeArray.join(',') + ']'
}

function genText (tokens) {
  return (tokens || []).map(
    item => item.type === AstTokenType.Literal ? JSON.stringify(item.token) : `_s(${item.token})`
  ).join('+')
}
