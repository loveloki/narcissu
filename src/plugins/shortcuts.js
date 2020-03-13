//输入空格后是否把节点从默认的paragraph转换为相应的节点
import { Editor, Transforms, Range } from 'slate'

const SHORTCUTS = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'list-item',
  '>': 'block-quote',
  '#': 'heading-one',
  '##': 'heading-two',
  '###': 'heading-three',
  '####': 'heading-four',
  '#####': 'heading-five',
  '######': 'heading-six',
}

const withShortcuts = editor => {
  const { insertText, insertBreak } = editor

  editor.insertText = text => {
    const { selection } = editor

    //当text为空格并且selection存在，且selection为一个光标的时候
    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      //获取空格前面的内容
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })

      const [, path] = match

      //获取空格前面的文本
      const start = Editor.start(editor, path)
      const { anchor } = selection
      //使用获取到的位置构建新的range
      const range = { anchor, focus: start}
      const beforeText = Editor.string(editor, range)

      const type = SHORTCUTS[beforeText]

      //如果存在此shortcut
      if (type) {
        const props = {type}

        if (type === 'heading') {
          const level = beforeText.length
          props.level = level
        }

        //删除shortcut字符
        Transforms.select(editor, range)
        Transforms.delete(editor)

        //设置节点类型
        Transforms.setNodes(
          editor,
          { ...props },
          { match: n => Editor.isBlock(editor, n) }
        )

        if (type === 'list-item') {
          const list = {type: 'bulleted-list', children: []}

          Transforms.wrapNodes(editor, list, {
            match: n => n.type === 'list-item',
          })
        }

        return
      }
    }

    //否则执行默认插入
    insertText(text)
  }

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection) {
      const leaf = Editor.leaf(editor, selection)
      const text = leaf[0].text.replace(/ /g, '')
      const firstLetter = text[0]
      const length = text.length

      //专门的换行
      if (length > 2
          && (firstLetter === '-' || firstLetter === '_' || firstLetter === '*')
          && text === firstLetter.repeat(length)
      ) {
        const type = 'thematic-break'

        Transforms.setNodes(
          editor,
          {type},
          {match: n => Editor.isBlock(editor, n)}
        )

        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: '' }] },
        )

        return
      }

      //围栏代码块
      const theFirstThreeText = text.slice(0, 3)
      const theRestText = text.slice(3)
      if (theFirstThreeText === '```') {
        const type = 'fenced-code-blocks'
        const lang = theRestText

        const path = Editor.path(editor, selection)
        const range = Editor.range(editor, path)
        Transforms.select(editor, range)
        Transforms.delete(editor)

        Transforms.setNodes(
          editor,
          {type, lang},
          {match: n => Editor.isBlock(editor, n)}
        )

        return
      }
    }

    insertBreak()
  }

  return editor
}

export default withShortcuts
