import {parseHtml} from './html_parser'
import {isSpecialTag} from '../web/util/index'
import {each, has, warn, error, camelize} from '../util/index'
import {parseText} from './text_parser'
import {AstElementType, AstDirective} from './ast_type'

const eachRE = /^\s*\(?(\s*\w*\s*,?\s*\w*\s*)\)?\s+in\s+(.+)$/

/**
 * Parse the template into an AST tree
 * @param template, the html template
 */
export function parse (template) {
  let root, currentParent
  let stack = []
  let isInPre = false
  parseHtml(template, {
    start: function startTag (tagName, attrs, unary) {
      let tag = tagName.toLowerCase()
      if (isSpecialTag(tag)) {
        throw new Error('Tag is not allowed in the template:' + tagName)
      }
      if (tag === 'pre') {
        isInPre = true
      }
      ensureSingleRoot(root, currentParent)

      let element = {
        type: AstElementType.Element,
        tagName: tag,
        attrList: attrs,
        attributes: toAttributeMap(attrs),
        children: []
      }

      if (element.attributes[AstDirective.Each]) {
        parseEach(element)
      }
      if (element.attributes[AstDirective.If]) {
        parseIf(element)
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
      const elem = stack[stack.length - 1]
      stack.pop()
      if (elem.tagName === 'pre') {
        isInPre = false
      }
      currentParent = stack.length > 0 ? stack[stack.length - 1] : null
    },
    chars: function chars (text) {
      if (!isInPre) {
        text = text.trim()
      }
      if (text.length === 0) {
        return
      }
      ensureSingleRoot(root, currentParent)

      const tokens = parseText(text)
      let textElement = {
        type: AstElementType.Text,
        rawValue: text,
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
    const attrName = camelize(attr.name)
    if (has(map, attrName)) {
      warn(`Found a duplicated attribute, name: ${attr.name}, value:${attr.value}`)
    }

    let attrInfo = {
      rawName: attr.name,
      rawValue: attr.value,
      tokens: parseText(attr.value.trim())
    }

    map[attrName] = attrInfo
  })
  return map
}

function parseIf (element) {
  const attr = element.attributes[AstDirective.If]
  delete element.attributes[AstDirective.If]

  if (!validateDirectiveSyntax(attr, AstDirective.If)) {
    return
  }

  element.if = {
    condition: attr.tokens[0].token
  }
}

function parseEach (element) {
  const attr = element.attributes[AstDirective.Each]
  delete element.attributes[AstDirective.Each]

  if (!validateDirectiveSyntax(attr, AstDirective.Each)) {
    return
  }

  // Supported syntax:
  // each={value in array}, each={(value,index) in array}
  // each={value in object}, each={(value,key) in object}
  const eachStatement = attr.tokens[0].token
  eachRE.lastIndex = 0
  const matches = eachRE.exec(eachStatement)
  if (!matches) {
    error(`Invalid each statement: ${eachStatement}`)
  } else {
    element.each = {
      variables: matches[1].split(',').join(','), // remove the trailing and preceding ','
      object: matches[2]
    }
  }
}

function validateDirectiveSyntax (attr, dirType) {
  if (!attr.rawValue) {
    warn(`${dirType} directive cannot be empty`)
    return false
  }

  if (attr.tokens.length !== 1) {
    warn(`The Expression of directive ${dirType}: ${attr.rawValue} is invalid`)
    return false
  }
  return true
}

function ensureSingleRoot (root, currentParent) {
  if (!currentParent && root) {
    throw new Error('Component template can only have one root element')
  }
}
