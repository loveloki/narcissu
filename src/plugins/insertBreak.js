//按下回车键的行为
import { Editor, Range, Transforms } from 'slate'

const withInsertBreak = editor => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    const match = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n),
    })

    if (match) {
      const [block, ] = match
      const { selection } = editor

      //获取文本节点
      const leaf = Editor.leaf(editor, selection)
      const text = leaf[0].text

      const isPoint = Range.isCollapsed(selection)

      if (isPoint && text === '' && block.type !== 'paragraph') {
        editor.deleteBackward('character')

        return
      }

      if (block.type.includes('heading')) {
        insertBreak()
        Transforms.setNodes(editor,{
          type: 'paragraph'
        })

        return
      }
    }

    insertBreak()
  }

  return editor
}

export default withInsertBreak
