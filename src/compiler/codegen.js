import {AstElementType} from './ast_parser'
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
  return (
    JSON.stringify(element.text)
  )
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
