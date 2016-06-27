import {has, makeMap} from '../../util/index'

export const namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
}

var svgMap = makeMap(
  'animate,circle,defs,ellipse,g,line,linearGradient,mask,path,pattern,polygon,polyline,' +
  'radialGradient,rect,stop,svg,text,tspan'
)

const svgAttributeNamespaces = {
  ev: 'http://www.w3.org/2001/xml-events',
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace',
  xmlns: 'http://www.w3.org/2000/xmlns/'
}

export function isSvgElement (name) {
  return has(svgMap, name)
}

/**
 * Get namespace of svg attribute
 *
 * @param {String} attributeName
 * @return {String} namespace
 */

export function getSvgAttributeNamespace (attributeName) {
  // if no prefix separator in attributeName, then no namespace
  if (attributeName.indexOf(':') === -1) return null

  // get prefix from attributeName
  var prefix = attributeName.split(':', 1)[0]

  // if prefix in supported prefixes
  if (has(svgAttributeNamespaces, prefix)) {
    // then namespace of prefix
    return svgAttributeNamespaces[prefix]
  } else {
    // else unsupported prefix
    throw new Error('svg-attribute-namespace: prefix "' + prefix + '" is not supported by SVG.')
  }
}
// Special Elements (can contain anything)
var specialTag = makeMap('script,style')
export function isSpecialTag (tag) {
  return specialTag[tag]
}

// Elements without close Tag
var unaryTag = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr')
export function isUnaryTag (tag) {
  return unaryTag[tag]
}
