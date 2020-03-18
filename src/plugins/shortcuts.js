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
    const isCollapsed = selection && Range.isCollapsed(selection)

    //当text为空格并且selection存在，且selection为一个光标的时候
    if (text === ' ' && isCollapsed) {
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

    //判断是否输入链接
    if ((text === '[' || text === ']' || text === '(' || text === ')' )&& isCollapsed) {
      insertText(text)

      const leafText = Editor.leaf(editor, selection)[0].text
      const path = Editor.path(editor, selection)

      const link = /\[([^\]]*)]\(([^)]*)\)/g
      const tokens = []

      let m
      while ((m = link.exec(leafText)) !== null) {
        const start = m.index
        const end = start + m[0].length
        tokens.push({ start, end, match: m })
      }

      //处理tokens
      tokens.forEach(({start, end, match}) => {
        const text = match[1]
        const url = match[2]
        const range = {
          anchor: { path, offset: start },
          focus: { path, offset: end },
        }

        const link = {
          type: 'link',
          url,
          children: [{ text }],
        }

        Transforms.select(editor, range)
        Transforms.delete(editor)
        Transforms.insertNodes(editor, link)
      })

      return
    }

    //判断是否为strong或em
    if(isCollapsed && text === '*') {
      insertText(text)

      const leafText = Editor.leaf(editor, selection)[0].text
      const path = Editor.path(editor, selection)

      const RegexRules = {
        strong: /((?:\*|_){2})([^*_]+?)(\1)/g,
        em: /(\*|_)([^*_]+?)(\1)/g,
      }

      const tokenize = (text) => {
        const tokens = []
        for (const type in RegexRules) {
          if (RegexRules.hasOwnProperty(type)) {
            const regex = RegexRules[type]
            let m

            while ((m = regex.exec(text)) !== null) {
              const start = m.index
              const end = start + m[0].length
              tokens.push({ start, end, type, match: m })
            }
          }
        }

        return tokens
      }

      const tokens = tokenize(leafText)

      //处理tokens
      tokens.forEach(({start, end, type, match}) => {
        console.log(type, typeof type);

        const text = match[2]
        const range = {
          anchor: { path, offset: start },
          focus: { path, offset: end },
        }

        const node = {
          type,
          children: [{ text }],
        }

        Transforms.select(editor, range)
        Transforms.delete(editor)
        Transforms.insertNodes(editor, node)
      })

      return
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
