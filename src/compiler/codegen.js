import {AstElementType, AstTokenType} from './ast_type'
import {each, uniqueId, warn} from '../util/index'
import events from '../web/util/events'

const eventNameMap = {}
each(events, (eventName, standardName) => {
  eventNameMap['on-' + eventName] = standardName
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
  var tempVarDefs = []
  var code = genElement(ast, tempVarDefs)
  return [tempVarDefs.join(''), code]
}

function genElement (element, tempVarDefs) {
  // For element
  if (element.type === AstElementType.Element) {
    return (
      `_h("${element.tagName}",` + genAttributes(element, tempVarDefs) + ',' +
        genChildren(element, tempVarDefs) +
      ')'
    )
  }

  // For text
  return genText(element.tokens)
}

function genAttributes (element, tempVarDefs) {
  // Handles the event handlers like on-click
  var results = []
  each(element.attributes, (attrValue, attrName) => {
    if (eventNameMap[attrName] && attrValue.length === 1) {
      if (attrValue[0].type !== AstTokenType.Expr) {
        warn('Event handler needs to be wrapped inside the {}')
      }
      const standardEventName = eventNameMap[attrName]
      const handlerInfo = genEventHandler(attrValue[0].token)
      results.push(`"${standardEventName}":${handlerInfo.funcName}`)
      tempVarDefs.push(handlerInfo.funcDef)
    } else {
      const attrExpr = genText(attrValue)
      results.push(`"${attrName}":${attrExpr}`)
    }
  })
  return '{' + results.join(',') + '}'
}

function genChildren (element, tempVarDefs) {
  if (!element.children) {
    return '[]'
  }

  let children = element.children
  let childrenCodeArray = children.map(child => genElement(child, tempVarDefs))
  return '[' + childrenCodeArray.join(',') + ']'
}

// Convent the tokens array into expression,e.g [{text: '11', type: Literal}, {text: 'name', type: Expr}]
// will be converted to '11' + _s(name)
function genText (tokens) {
  return (tokens || []).map(
    item => item.type === AstTokenType.Literal ? JSON.stringify(item.token) : `_s(${item.token})`
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
  const hasParam = matches.length >= 3 && matches[2]
  let callCode = hasParam ? handlerCode : handlerCode + '($event)'

  const wrapperName = '$$eh' + '_' + uniqueId()
  return {
    funcName: wrapperName,
    funcDef: `var ${wrapperName}=function($event){${callCode}};`
  }
}

