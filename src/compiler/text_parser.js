import {AstTokenType} from './ast_type'

const defaultTagRE = /\{((?:.|\n)+?)}/g

/* Parse the text into tokens, e.g. This is {token} will be parsed to:
[
  {text: 'This is ', type: 0}, 0 - text literal
  {text: 'token', type: 1}, 1 - expression
]
* */
export function parseText (text) {
  const tagRE = defaultTagRE
  if (!tagRE.test(text)) {
    return [{
      token: text,
      type: AstTokenType.Literal
    }]
  }
  const tokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      tokens.push({
        token: text.slice(lastIndex, index),
        type: AstTokenType.Literal
      })
    }
    // tag token
    const exp = match[1].trim()
    tokens.push({
      token: exp,
      type: AstTokenType.Expr
    })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push({
      token: text.slice(lastIndex),
      type: AstTokenType.Literal
    })
  }
  return tokens
}
