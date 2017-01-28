import {AstTokenType} from './ast_type'

const startSymbol = '{'
const endSymbol = '}'
const startSymbolLength = startSymbol.length
const endSymbolLength = endSymbol.length

const escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g')
const escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g')

function escape (ch) {
  return '\\\\\\' + ch
}

function unescapeText (text) {
  return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol)
}

/* Parse the text into tokens, e.g. 'This is {token}' will be parsed to:
 [
 {text: 'This is ', type: 0}, 0 - text literal
 {text: 'token', type: 1}, 1 - expression
 ]
 * */
export default function parseText (text) {
  if (!text.length || text.indexOf(startSymbol) === -1) {
    return [{
      token: unescapeText(text),
      type: AstTokenType.Literal
    }]
  }

  const textLen = text.length
  let tokens = []
  let index = 0

  while (index < textLen) {
    let startIndex, endIndex
    let str, exp
    if (((startIndex = text.indexOf(startSymbol, index)) !== -1) &&
      ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) !== -1)) {
      if (index !== startIndex) {
        str = unescapeText(text.substring(index, startIndex))
        tokens.push({
          token: str,
          type: AstTokenType.Literal
        })
      }
      let iRight = indexOfRightMostEndSymbol(text, endIndex)
      if (iRight !== -1) {
        endIndex = iRight
      }
      exp = text.substring(startIndex + startSymbolLength, endIndex)
      tokens.push({
        token: exp,
        type: AstTokenType.Expr
      })
      index = endIndex + endSymbolLength
    } else {
      // did not find an interpolation, so we have to add the remainder to the separators array
      if (index !== text.length) {
        str = unescapeText(text.substring(index))
        tokens.push({
          token: str,
          type: AstTokenType.Literal
        })
      }
      break
    }
  }
  return tokens
}

// find the index of the right most endSymbol in order to parse the object literal {{foo:1}} without escaping
function indexOfRightMostEndSymbol (text, startIndex) {
  let endSymbolIndex = -1
  let i = startIndex
  while (i < text.length) {
    if (text[i] === startSymbol) {
      break
    }

    if (text[i] === endSymbol) {
      endSymbolIndex = i
      i += endSymbolLength
    } else {
      i++
    }
  }
  return endSymbolIndex
}
