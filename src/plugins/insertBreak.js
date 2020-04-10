//按下回车键的行为
import { Editor, Range, Transforms, Path } from 'slate'

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

      const [parent, parentPath] = Editor.parent(editor, path)

      //如果在引用块的空段落出按回车，将段落向上提升拆分出来
      if (isPoint && text === '' && block.type === 'paragraph' && (parent.type === 'block-quote')) {
        Transforms.liftNodes(editor, {
          at: path,
          voids: true,
        })

        return
      }

      if (block.type === 'paragraph' && parent.type === 'list-item' && parent.children.length === 1) {
        const [, ulPath] = Editor.parent(editor, parentPath)
        const match = Editor.next(editor, {
          at: parentPath,
          match: n => n.type === 'list-item'
        })

        let last = true
        if (match) {
          const [, path] = match
          last = Path.isChild(path, ulPath) ? false : true
        }

        if (text !== '') {
          //list spilt
          Transforms.splitNodes(editor, {
            at: selection,
            match: n => n.type === 'list-item',
            always: true,
          })
        } else if (last) {
          //list delete and lift,提升拆分两次，提升到ul同级节点
          Transforms.liftNodes(editor, {
            at: path,
            voids: true,
          })
          Transforms.liftNodes(editor, {
            at: selection,
            voids: true,
          })
        } else {
          Transforms.delete(editor, {
            at: parentPath,
          })
        }

        return
      }
      if (block.type === 'paragraph' && parent.type === 'list-item' && parent.children.length !== 1) {
        if (text === '') {
          //list lift and setNodes
          Transforms.liftNodes(editor, {
            at: editor.selection,
            match: n => n.type === 'paragraph',
            always: true,
          })
          Transforms.setNodes(editor,{
            type: 'list-item'
          })
        } else {
          insertBreak()
        }

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
