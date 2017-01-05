import {AstElementType, AstTokenType} from './ast_type'
import {each, uniqueId, warn, capitalize} from '../util/index'
import events from '../web/util/events'

const eventNameMap = {}
each(events, (eventName, standardName) => {
  eventNameMap['on' + capitalize(eventName)] = standardName
})

const funcRE = /([^()]+)(\(.*\))?/

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
    let createElemCode = (
      `_h("${element.tagName}",` + genAttributes(element) + ',' +
        genChildren(element) +
      ')'
    )

    // Has Each directive: each="(v, k) in obj"
    if (element.each) {
      createElemCode = `_c(${element.each.object},function(${element.each.variables}){return ${createElemCode}})`
    }

    // Has If directive, if="a > 0"
    if (element.if) {
      createElemCode = `${element.if.condition}?${createElemCode}:null`
    }
    return createElemCode
  }

  // For text
  return genText(element.tokens)
}

function genAttributes (element) {
  // Handles the event handlers like on-click
  var results = []
  each(element.attributes, (attr, attrName) => {
    if (eventNameMap[attrName] && attr.tokens.length === 1) {
      const standardEventName = eventNameMap[attrName]
      const handlerCode = genEventHandler(attr.tokens[0].token)
      if (handlerCode) {
        results.push(`"${standardEventName}":${handlerCode}`)
      } else {
        warn(`Invalid value found for ${attr.rawName}`)
      }
    } else {
      const attrExpr = genText(attr.tokens)
      results.push(`"${attrName}":${attrExpr}`)
    }
  })
  return '{' + results.join(',') + '}'
}

function genChildren (element) {
  if (!element.children) {
    return '[]'
  }

  let children = element.children
  let childrenCodeArray = children.map(child => genElement(child))
  return '[' + childrenCodeArray.join(',') + ']'
}

// Convent the tokens array into expression,e.g [{text: '11', type: Literal}, {text: 'name', type: Expr}]
// will be converted to '11' + name
function genText (tokens) {
  return (tokens || []).map(
    item => item.type === AstTokenType.Literal ? JSON.stringify(item.token) : item.token
  ).join('+')
}

// convert event attribute
//
// on-click="handleClick"
// on-click="handleClick(1)"
//
// to something like below:
// var handleClick_rand = function(event){handleClick(1);}
function genEventHandler (handlerCode) {
  funcRE.lastIndex = 0
  const matches = funcRE.exec(handlerCode)
  if (!matches) {
    return null
  }

  const hasParam = matches.length >= 3 && matches[2]
  let callCode = hasParam ? handlerCode : handlerCode + '($event)'

  return `function($event){${callCode}}`
}
