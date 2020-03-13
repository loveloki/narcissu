//定义哪些节点被视为空节点

const withVoid = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'thematic-break' ? true : isVoid(editor)
  }

  return editor
}

export default withVoid
