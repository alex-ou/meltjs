import {parseHtml} from './html_parser'
import {isSpecialTag} from '../web/util/index'
import {each, has, warn} from '../util/index'
import {parseText} from './text_parser'
import {AstElementType, AstTokenType, AstDirective} from './ast_type'

/**
 * Parse the template into an AST tree
 * @param template, the html template
 */
export function parse (template) {
  let root, currentParent
  let stack = []
  parseHtml(template, {
    start: function startTag (tagName, attrs, unary) {
      let tag = tagName.toLowerCase()
      if (isSpecialTag(tag)) {
        throw new Error('Tag is not allowed in the template:' + tagName)
      }
      ensureSingleRoot(root, currentParent)

      let element = {
        type: AstElementType.Element,
        tagName: tag,
        attrList: attrs,
        attributes: toAttributeMap(attrs),
        children: []
      }

      const ifAttrValue = element.attributes[AstDirective.If]
      if (ifAttrValue) {
        element.if = parseIf(ifAttrValue)
      }

      if (!root) {
        root = element
      }

      if (currentParent) {
        currentParent.children.push(element)
      }

      if (!unary) {
        currentParent = element
        stack.push(element)
      }
    },
    end: function endTag () {
      stack.pop()
      currentParent = stack.length > 0 ? stack[stack.length - 1] : null
    },
    chars: function chars (text) {
      ensureSingleRoot(root, currentParent)

      const tokens = parseText(text.trim())
      let textElement = {
        type: AstElementType.Text,
        tokens: tokens
      }

      // Template only has the text, add a span to wrap the text
      if (!root) {
        root = currentParent = {
          type: AstElementType.Element,
          tagName: 'span',
          children: []
        }
      }

      // Text as a child
      if (currentParent) {
        currentParent.children.push(textElement)
      }
    }
  })
  return root
}

/**
 * Convert a list of attribute object in form of {name: 'aa', value: 'bb'}
 * to an object map {aa: bb}
 * @param attrList
 */
function toAttributeMap (attrList) {
  var map = {}
  each(attrList, attr => {
    const attrName = attr.name
    if (has(map, attrName)) {
      warn(`Found a duplicated attribute, name: ${attr.name}, value:${attr.value}`)
    }

    map[attrName] = parseText(attr.value.trim())
  })
  return map
}

function parseIf (attrValue) {
  if (!attrValue || attrValue.length === 0) {
    warn('Invalid If directive expression')
    return null
  }
  if (attrValue[0].type !== AstTokenType.Expr) {
    warn(`If directive Expression ${attrValue} is ignored as it's not wrapped inside the {}`)
    return null
  }
  return {
    condition: attrValue[0].token
  }
}

function ensureSingleRoot (root, currentParent) {
  if (!currentParent && root) {
    throw new Error('Component template can only has one root element')
  }
}
