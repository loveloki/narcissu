//输入空格后是否把节点从默认的paragraph转换为相应的节点
import { Editor, Transforms, Range } from 'slate'
import { EditorHelper } from '../constants/helper'

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

const RegexRules = {
  link: /\[([^\]]*)]\(([^)]*)\)/g,
  strong: /((?:\*|_){2})([^*_]+?)(\1)/g,
  em: /(\*|_)([^*_]+?)(\1)/g,
}

/**
 * @description: 根据text返回处理过的token数组
 * @description: token格式为：{type:: string, content:: array}
 * @description: content里面是object的数组, 其中标点符号{type: punctuation}, 普通文本{type: text}
 * @param {string}
 * @return: {array} [token1, token2, ...]
 */
const tokenize = (text) => {
  let tokens = [text]

  for (const type in RegexRules) {
    if (RegexRules.hasOwnProperty(type)) {
      const regex = RegexRules[type]

      for (let i = 0; i < tokens.length; i++) {
        let text = tokens[i]

        if (typeof text !== 'string') {
          continue
        }

        let start = 0
        let list = []

        //因为可能上一次匹配成功，所以手动重置lastIndex
        regex.lastIndex = 0
        let m = regex.exec(text)

        if (m !== null) {
          const from = m.index
          const to = from + m[0].length
          const before = text.slice(start, from)
          const after = text.slice(to)

          const getToken = (match, type) => {
            const token = {
              type,
            }

            if (type === 'em') {
              const content = [
                {type: 'punctuation', text: '*'},
                {type: 'text', text: match[2]},
                {type: 'punctuation', text: '*'},
              ]

              token.content = content
            } else if (type === 'strong') {
              const content = [
                {type: 'punctuation', text: '**'},
                {type: 'text', text: match[2]},
                {type: 'punctuation', text: '**'},
              ]

              token.content = content
            } else if (type === 'link') {
              const content = [
                {type: 'punctuation', text: '['},
                {type: 'text', text: match[1]},
                {type: 'punctuation', text: ']'},
                {type: 'punctuation', text: '('},
                {type: 'punctuation', text: match[2]},
                {type: 'punctuation', text: ')'},
              ]

              token.url = match[2]
              token.content = content
            }

            return token
          }

          const token = getToken(m, type)

          before && list.push(before)
          list.push(token)
          after && list.push(after)
          //替换原来的数据
          tokens.splice(i, 1, ...list)
        }
      }

    }
  }

  return tokens
}

const dealWithRegex = (text) => {
  const tokens = tokenize(text)
  //处理tokens
  const node = {
    type: 'paragraph',
    children: [],
  }

  for (const token of tokens) {
    if (typeof token !== 'string') {
      const { content, ...rest } = token
      node.children.push({children: content, ...rest})
    } else {
      node.children.push({text: token})
    }
  }

  return node
}

const withShortcuts = editor => {
  const { insertText, insertBreak, deleteBackward, deleteForward, deleteFragment } = editor

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

    //进行regex相关处理
    if (text && selection) {
      insertText(text)

      //获取整个paragraph的text
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })

      if (match) {
        const [, paragraphPath] = match
        const paragraphText = Editor.string(editor, paragraphPath)

        const offset = EditorHelper.findOffset(editor, selection)
        const newParagraph = dealWithRegex(paragraphText)

        //删除paragraph
        Transforms.removeNodes(editor)

        //然后...构建新的node, 插入
        Transforms.insertNodes(editor, newParagraph)

        //然后 移动selection
        const point = EditorHelper.findPoint(editor, offset)
        Transforms.select(editor, point)
      }

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

  editor.deleteForward = (...args) => {
    deleteForward(...args)

    const { selection } = editor

    //获取整个paragraph的text
    const match = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n),
    })

    if (match) {
      const [, paragraphPath] = match
      const paragraphText = Editor.string(editor, paragraphPath)

      const offset = EditorHelper.findOffset(editor, selection) - 1
      const newParagraph = dealWithRegex(paragraphText)

      //删除paragraph
      Transforms.removeNodes(editor)

      //然后...构建新的node, 插入
      Transforms.insertNodes(editor, newParagraph)

      //然后 移动selection
      const point = EditorHelper.findPoint(editor, offset)

      Transforms.select(editor, point)
    }

    return
  }

  editor.deleteBackward = (...args) => {
    deleteBackward(...args)

    const { selection } = editor

    //获取整个paragraph的text
    const match = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n),
    })

    if (match) {
      const [, paragraphPath] = match
      const paragraphText = Editor.string(editor, paragraphPath)

      const offset = EditorHelper.findOffset(editor, selection) - 1
      const newParagraph = dealWithRegex(paragraphText)

      //删除paragraph
      Transforms.removeNodes(editor)

      //然后...构建新的node, 插入
      Transforms.insertNodes(editor, newParagraph)

      //然后 移动selection
      const point = EditorHelper.findPoint(editor, offset)

      Transforms.select(editor, point)
    }

    return
  }

  editor.deleteFragment = (...args) => {
    deleteFragment(...args)

    const { selection } = editor

    //获取整个paragraph的text
    const match = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n),
    })

    if (match) {
      const [, paragraphPath] = match
      const paragraphText = Editor.string(editor, paragraphPath)

      const offset = EditorHelper.findOffset(editor, selection) - 1
      const newParagraph = dealWithRegex(paragraphText)

      //删除paragraph
      Transforms.removeNodes(editor)

      //然后...构建新的node, 插入
      Transforms.insertNodes(editor, newParagraph)

      //然后 移动selection
      const point = EditorHelper.findPoint(editor, offset)

      Transforms.select(editor, point)
    }

    return
  }

  return editor
}

export default withShortcuts
