export default class RefDirective {
  updateRef (refName, vnode) {
    let refs = vnode.parentComponent.refs
    if (!refs) {
      refs = vnode.parentComponent.refs = {}
    }

    // remove the old ref
    if (this._refName) {
      delete refs[this._refName]
    }

    if (refName) {
      refs[refName] = vnode.component || vnode.elem
      this._refName = refName
    }
  }

  attached (binding, vnode) {
    this.updateRef(binding.value, vnode)
  }

  updated (binding, newVnode) {
    this.updateRef(binding.value, newVnode)
  }

  detached (vnode) {
    this.updateRef(null, vnode)
  }
}
