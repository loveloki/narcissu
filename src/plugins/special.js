//定义哪些节点被视为特殊节点：空节点，inline节点...

const withSpecial = editor => {
  const { isVoid, isInline } = editor

  editor.isVoid = element => {
    switch (element.type) {
      case 'image':
      case 'thematic-break':
        return true
      default:
        return isVoid(editor)
    }
  }

  editor.isInline = element => {
    switch (element.type) {
      case 'image-box':
      case 'image':
      case 'link':
      case 'code':
      case 'em':
      case 'strong':
        return true
      default:
        return isInline(element)
    }
  }

  return editor
}

export default withSpecial
