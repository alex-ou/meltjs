import {parseHtml} from './html_parser'
import {isSpecialTag} from '../web/util/index'
import {each, has, warn} from '../util/index'

export const AstElementType = {
  Element: 1,
  Text: 2
}

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

      let textElement = {
        type: AstElementType.Text,
        text: text
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
    if (has(map, attr.name)) {
      warn(`Found a duplicated attribute, name: ${attr.name}, value:${attr.value}`)
    }
    map[attr.name] = attr.value
  })
  return map
}

function ensureSingleRoot (root, currentParent) {
  if (!currentParent && root) {
    throw new Error('Component template can only has one root element')
  }
}
