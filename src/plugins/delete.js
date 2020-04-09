//按下删除键的行为
import { Editor, Transforms, Range, Point, Path } from 'slate'

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

          if (block.type === 'thematic-break') {
            Transforms.removeNodes(editor)
          }

          return
        }

        if (block.type === 'paragraph' && Point.equals(selection.anchor, start)) {
          //获取本text节点的父节点的父节点，比如list-item节点
          const [parent, parentPath] = Editor.parent(editor, path)
          const [first, firstPath] = Editor.first(editor, parentPath)
          const firstStart = Editor.start(editor, firstPath)

          if (parent.type === 'list-item' && Point.equals(selection.anchor, firstStart)) {
            const [ul, ulPath] = Editor.parent(editor, parentPath)

            const match = Editor.previous(editor, {
              at: parentPath,
              match: n => n.type === 'list-item'
            })

            let first = true
            if (match) {
              const [node, path] = match
              first = Path.isChild(path, ulPath) ? false : true
            }

            //如果是第一个list-item节点
            if (first) {
              //将list-item解封
              Transforms.unwrapNodes(editor, { match: n => n.type === 'list-item'})

              //获取被解封的paragraph
              const array = Array.from(Editor.nodes(editor, {at:ulPath, match: n => n.type === 'paragraph'})).filter(([node, path]) => path.length === ulPath.length + 1).reverse()

              //向上提升它们
              array.forEach(([node, path]) => {
                Transforms.liftNodes(editor, {at: path, match: n => n.type === 'paragraph'})
              })
            } else {
              //将list-item解封
              Transforms.unwrapNodes(editor, { match: n => n.type === 'list-item'})

              //获取被解封的paragraph
              const array = Array.from(Editor.nodes(editor, {at:ulPath, match: n => n.type === 'paragraph'})).filter(([node, path]) => path.length === ulPath.length + 1)

              const path = Editor.path(editor, editor.selection)
              const at = Path.parent(path)
              const prevPath = Path.previous(at)
              const basePath = Editor.path(editor, prevPath, {edge: 'end'}).slice(0, prevPath.length + 1)
              const last = basePath[basePath.length - 1]

              //移动到上一个list-item末尾
              for (let i = 0; i < array.length; i++) {
                const to = basePath.slice(0, basePath.length - 1).concat(last + i + 1)

                Transforms.moveNodes(editor, {at: at, to: to})
              }
            }

            return
          }
        }
      }
    }

    //执行默认删除
    deleteBackward(...args)
  }

  return editor
}

export default withDelete
