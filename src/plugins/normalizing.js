import { Element, Node, Transforms, Editor } from 'slate'

const withNormalizing = editor => {
  const { normalizeNode } = editor

  editor.normalizeNode = entry => {
    const [node, path] = entry

    //引用块儿和列表项只能包含block,如果不是block，用paragraph包裹起来。
    if (Element.isElement(node) && (node.type === 'block-quote' || node.type === 'list-item')) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (!Editor.isBlock(editor, child)) {
          const p = {
            type: 'paragraph',
            children: [],
          }
          Transforms.wrapNodes(editor, p, { at: childPath })
          return
        }
      }
    }

    normalizeNode(entry)
  }

  return editor
}

export default withNormalizing
