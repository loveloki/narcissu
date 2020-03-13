//按下删除键的行为
import { Editor, Transforms, Range, Point } from 'slate'

const withDelete = editor => {
  const { deleteBackward } = editor

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (block.type !== 'paragraph' && Point.equals(selection.anchor, start)) {
          Transforms.setNodes(editor, {type: 'paragraph'})

          if (block.type === 'list-item') {
            //获取本text节点的父节点的父节点，即ul所在节点
            const parent = Editor.parent(editor, selection)
            const pParent = Editor.parent(editor, parent[1])

            //获取节点类型，子节点数量，本节点是否为最后一个节点
            const type = pParent[0].type
            const childrenNumber = pParent[0].children.length
            const lastChild = pParent[0].children[childrenNumber - 1]
            const flag = lastChild.children === block.children


            if (type === 'bulleted-list' && childrenNumber === 1) {
              //如果只有一个节点，直接拆封
              Transforms.unwrapNodes(editor,{
                match: n => n.type === 'bulleted-list',
              })
            } else if (flag) {
              //如果有其他节点，并且本节点位于最后一个，向上拆分提升
              Transforms.liftNodes(editor, {
                match: n => n.type === 'paragraph',
              })
            } else {
              //否则本节点在中间，执行默认删除
              deleteBackward(...args)
            }

          }

          if (block.type === 'thematic-break') {
            Transforms.removeNodes(editor)
          }

          return
        }
      }
    }

    //执行默认删除
    deleteBackward(...args)
  }

  return editor
}

export default withDelete
