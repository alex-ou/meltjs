function onMount (vnode) {
  updateRef(vnode)
}

function onUpdate (oldVnode, newVnode) {
  updateRef(oldVnode, true)
  updateRef(newVnode)
}

function onUnmount (vnode) {
  updateRef(vnode, true)
}

export default {
  onMount,
  onUpdate,
  onUnmount
}

function updateRef (vnode, isRemoving) {
  const name = vnode.props.ref
  if (!name) {
    return
  }
  const ref = vnode.component || vnode.elem
  let refs = vnode.parentComponent.refs
  if (isRemoving) {
    delete refs[name]
  } else {
    refs[name] = ref
  }
}
