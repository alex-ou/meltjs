import {makeMap} from '../util/index'
import {isSpecialTag} from '../web/util/index'

// Regular Expressions for parsing tags and attributes
let startTagRE = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
let endTagRE = /^<\/([-A-Za-z0-9_]+)[^>]*>/
let attrRE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g

// Elements without close Tag
var unaryTag = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr')

// Block Elements
var blockTag = makeMap('a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video')

// Inline Elements
var inlineTag = makeMap('abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var')

// Elements that you can, intentionally, leave open (and which close themselves)
var closeSelfTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr')

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected')

export function parseHtml (html, handler) {
  let stack = []
  let last = html
  stack.last = function () {
    return this[this.length - 1]
  }

  while (html) {
    let index, chars, match
    chars = true

    // Make sure we're not in a script or style element
    if (!stack.last() || !isSpecialTag(stack.last())) {
      // Comment
      if (html.indexOf('<!--') === 0) {
        index = html.indexOf('-->')

        if (index >= 0) {
          if (handler.comment) {
            handler.comment(html.substring(4, index))
          }
          html = html.substring(index + 3)
          chars = false
        }

        // end tag
      } else if (html.indexOf('</') === 0) {
        match = html.match(endTagRE)

        if (match) {
          html = html.substring(match[0].length)
          match[0].replace(endTagRE, parseEndTag)
          chars = false
        }

        // start tag
      } else if (html.indexOf('<') === 0) {
        match = html.match(startTagRE)

        if (match) {
          html = html.substring(match[0].length)
          match[0].replace(startTagRE, parseStartTag)
          chars = false
        }
      }

      if (chars) {
        index = html.indexOf('<')

        var text = index < 0 ? html : html.substring(0, index)
        html = index < 0 ? '' : html.substring(index)

        if (handler.chars) {
          handler.chars(text)
        }
      }
    } else {
      html = html.replace(new RegExp('([\\s\\S]*?)</' + stack.last() + '[^>]*>'), function (all, text) {
        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2')
        if (handler.chars) {
          handler.chars(text)
        }

        return ''
      })

      parseEndTag('', stack.last())
    }

    if (html === last) {
      throw Error('Parse Error: ' + html)
    }
    last = html
  }

  // Clean up any remaining tags
  parseEndTag()

  function parseStartTag (tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase()

    if (blockTag[tagName]) {
      while (stack.last() && inlineTag[stack.last()]) {
        parseEndTag('', stack.last())
      }
    }

    if (closeSelfTag[tagName] && stack.last() === tagName) {
      parseEndTag('', tagName)
    }

    unary = unaryTag[tagName] || !!unary

    if (!unary) {
      stack.push(tagName)
    }

    if (handler.start) {
      var attrs = []

      rest.replace(attrRE, function (match, name) {
        var value = arguments[2] ? arguments[2]
          : arguments[3] ? arguments[3]
          : arguments[4] ? arguments[4]
          : fillAttrs[name] ? name : ''

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"') // "
        })
      })

      if (handler.start) {
        handler.start(tagName, attrs, unary)
      }
    }
  }

  function parseEndTag (tag, tagName) {
    let pos
    // If no tag name is provided, clean shop
    if (!tagName) {
      pos = 0
    } else {
      // Find the closest opened tag of the same type
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] === tagName) {
          break
        }
      }
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (handler.end) {
          handler.end(stack[i])
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
    }
  }
}
