//定义哪些节点被视为特殊节点：空节点，inline节点...

const withSpecial = editor => {
  const { isVoid, isInline } = editor

  editor.isVoid = element => {
    return element.type === 'thematic-break' ? true : isVoid(editor)
  }

  editor.isInline = element => {
    switch (element.type) {
      case 'link':
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
