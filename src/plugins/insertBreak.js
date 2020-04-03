//按下回车键的行为
import { Editor, Range, Transforms } from 'slate'

const withInsertBreak = editor => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    const match = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n),
    })

    if (match) {
      const [block, path] = match
      const { selection } = editor

      //获取文本节点
      const text = Editor.string(editor, path)

      const isPoint = Range.isCollapsed(selection)

      if (isPoint && text === '' && block.type !== 'paragraph') {
        editor.deleteBackward('character')

        return
      }

      const [parent, ] = Editor.parent(editor, path)

      //如果在引用块的空段落出按回车，将段落拆分出来
      if (isPoint && text === '' && block.type === 'paragraph' && (parent.type === 'block-quote')) {
        Transforms.liftNodes(editor, {
          at: path,
          voids: true,
        })

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
