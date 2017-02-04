function updateRef (vnode, isRemoving) {
  const name = vnode.props.ref
  if (!name) {
    return
  }
  const ref = vnode.component || vnode.elem

  let refs = vnode.parentComponent.refs
  if (!refs) {
    refs = vnode.parentComponent.refs = {}
  }
  if (isRemoving) {
    delete refs[name]
  } else {
    refs[name] = ref
  }
}

export default class RefDirective {
  attached (_, vnode) {
    updateRef(vnode)
  }

  updated (_, newVnode, oldVnode) {
    updateRef(oldVnode, true)
    updateRef(newVnode)
  }

  detached (vnode) {
    updateRef(vnode, true)
  }
}
