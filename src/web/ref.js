import {isArray} from '../util/index'

function onMount (vnode) {
  addRef(vnode, vnode)
}

function onUpdate (oldVnode, newVnode) {
  removeRef(oldVnode)
  addRef(newVnode)
}

function onUnmount (vnode) {
  removeRef(vnode)
}

export default {
  onMount,
  onUpdate,
  onUnmount
}

function addRef (vnode) {
  const name = vnode.props.ref
  if (!name) {
    return
  }
  const ref = vnode.component || vnode.elem
  let refs = vnode.parentComponent.refs
  const existingRef = refs[name]
  if (!existingRef) {
    refs[name] = ref
  } else if (isArray(existingRef)) {
    refs[name].push(ref)
  } else {
    refs[name] = [existingRef, ref]
  }
}

function removeRef (name, vnode) {
  if (!name) {
    return
  }
  const ref = vnode.component || vnode.elem
  let refs = vnode.parentComponent.refs
  if (isArray(refs)) {
    refs[name] = refs.filter(item => item !== ref)
  } else {
    delete refs[name]
  }
}
