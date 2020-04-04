//处理返回不同元素
import React from 'react'
import './index.css'
import { useSelected, useFocused, useEditor } from 'slate-react'
import StorageManager from '../../constants/storage'
import { Editor, Point, Transforms } from 'slate'

const typeList = {
  'heading-one' : 'h1',
  'heading-two' : 'h2',
  'heading-three' : 'h3',
  'heading-four' : 'h4',
  'heading-five' : 'h5',
  'heading-six' : 'h6',
  'thematic-break': 'hr',
  'fenced-code-blocks': 'code',
}

const Element = props => {
  const { attributes, children, element } = props
  const isTypeTipOpen = StorageManager.get('isTypeTipOpen')
  const selected = useSelected()
  const focused = useFocused()

  switch (element.type) {
    case 'heading-one':
    case 'heading-two':
    case 'heading-three':
    case 'heading-four':
    case 'heading-five':
    case 'heading-six':
    case 'thematic-break':
    case 'fenced-code-blocks':
      return <LeafBlocks {...props} type={typeList[element.type]} isTypeTipOpen={isTypeTipOpen} />
    case 'block-quote':
      return <blockquote data-tip={'quote'} className={(isTypeTipOpen && focused && selected) ? 'tip' : ''} {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul data-tip={'ul'} className={(isTypeTipOpen && focused && selected) ? 'tip' : ''} {...attributes}>{children}</ul>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'link':
      return <Link {...props} />
    case 'code':
      return <Code {...props} />
    case 'strong':
      return <Strong {...props} />
    case 'em':
      return <Em {...props} />
    case 'image-box':
      return <ImageBox {...props} />
    case 'image':
      return <Image {...props} />
    default:
      return <P {...props} isTypeTipOpen={isTypeTipOpen} />
  }
}

const LeafBlocks = props => {
  const { attributes, children, type, isTypeTipOpen } = props
  const Type = type
  const selected = useSelected()
  const focused = useFocused()
  const adjustClassName = (() => {
    switch (type) {
      case 'h1':
        return ' tipH1'
      case 'h2':
        return ' tipH2'
      case 'h3':
        return ' tipH3'
      case 'h4':
        return ' tipH4'
      default:
        return ''
    }
  })()

  if (type === 'hr') {
    return <ThematicBreak {...props} selected={selected} focused={focused} />
  } else if (type === 'code') {
    return <FencedCodeBlocks {...props} selected={selected} focused={focused} />
  }

  return <Type data-tip={type} className={(isTypeTipOpen && focused && selected) ? 'tip' + adjustClassName : ''} {...attributes}>{children}</Type>
}

const ThematicBreak = props => {
  const { attributes, children, selected, focused, isTypeTipOpen } = props

  return (
    <div {...attributes} className='block'>
      <div contentEditable={false}>
        <hr
          className={(isTypeTipOpen && focused && selected) ? 'tip tipHr' : ''}
          style={
            { boxShadow: (selected && focused) ? '0 0 0 3px #B4D5FF' : 'none' }
          }
          data-tip={'hr'}
          />
      </div>
      {children}
    </div>
  )

}

const FencedCodeBlocks = props => {
  const { attributes, children, selected, focused, isTypeTipOpen, element } = props
  const { lang } = element

  return (
    <pre className={((isTypeTipOpen && focused && selected) ? 'tip tipCode' : '') + ' language-' + lang} data-tip={'code'}>
      <div {...attributes}>
        {children}
      </div>
    </pre>
  )
}

const Link = props => {
  const { element,  attributes, children } = props
  const { url } = element

  return (
    <a {...attributes} href={url}>
      {children}
    </a>
  )
}

const Code = props => {
  const { attributes, children } = props

  return (
    <code {...attributes}>
        {children}
    </code>
  )
}
const Strong = props => {
  const { attributes, children } = props

  return (
    <span {...attributes}>
      <strong>
        {children}
      </strong>
    </span>
  )
}

const Em = props => {
  const { attributes, children } = props

  return (
    <span {...attributes}>
      <em>
        {children}
      </em>
    </span>
  )
}
const ImageBox = props => {
  const { attributes, children } = props

  return (
    <span {...attributes}>
        {children}
    </span>
  )
}

const Image = props => {
  const { attributes, children, element } = props
  const { url } = element
  const selected = useSelected()
  const focused = useFocused()

  return (
    <span {...attributes}>
      <img src={url}
        contentEditable={false}
        alt="img"
        style={{
          boxShadow: (focused && selected) ? '0 0 0 3px #B4D5FF' : 'none',
        }}
      />
      {children}
    </span>
  )
}

const P = props => {
  const { attributes, children, isTypeTipOpen } = props
  const focused = useFocused()
  const selected = useSelected()
  const editor = useEditor()
  const { selection } = editor

  const match = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n)
  })

  if (match && selection && focused && selected) {
    const [, path] = match

    const nodePositionInParent = () => {
      //获取 parent 相关信息
      const start_parent = Editor.start(editor, path)
      const end_parent = Editor.end(editor, path)

      //获得现在的 node 的相关信息,直接通过editor.selection
      const path_current = Editor.path(editor, selection)
      const start_current = Editor.start(editor, path_current)
      const end_current = Editor.end(editor, path_current)

      if (Point.equals(start_current, start_parent)) {
        if (Point.equals(end_current, end_parent)) {
          return 'only'
        }
        return 'first'
      } else if (Point.equals(end_current, end_parent)) {
        return 'end'
      } else {
        return 'inside'
      }
    }

    const parent_c = Editor.parent(editor, selection)
    const type = parent_c[0].type

    if (type === 'paragraph') {
      const position = nodePositionInParent()
      if (position === 'first') {
        const next = Editor.next(editor)
        const path = next[1]
        const node = Editor.above(editor, {at: path})[0]
        const isInline = Editor.isInline(editor, node)

        if (isInline) {
          const start_n = Editor.start(editor, path)
          const path_c = Editor.path(editor, selection)
          const point = Editor.point(editor, selection)
          const end = Editor.end(editor, path_c)
          const flag = Point.equals(end, point)

          //移动光标到 inline 节点里面
          flag && Transforms.select(editor, start_n)
        }

      } else if (position === 'end') {
        const prev = Editor.previous(editor)
        const path = prev[1]
        const node = Editor.above(editor, {at: path})[0]
        const isInline = Editor.isInline(editor, node)

        if (isInline) {
          const end_p = Editor.end(editor, path)
          const path_c = Editor.path(editor, selection)
          const point = Editor.point(editor, selection)
          const start = Editor.start(editor, path_c)
          const flag = Point.equals(start, point)

          //移动光标到 inline 节点里面
          flag && Transforms.select(editor, end_p)
        }

      } else if (position === 'inside') {
        const prev = Editor.previous(editor)
        const next = Editor.next(editor)

        const path_p = prev[1]
        const node_p = Editor.above(editor, {at: path_p})[0]
        const isInline_p = Editor.isInline(editor, node_p)

        const path_n = next[1]
        const node_n = Editor.above(editor, {at: path_n})[0]
        const isInline_n = Editor.isInline(editor, node_n)

        if (isInline_p) {
          const end_p = Editor.end(editor, path_p)
          const path_c = Editor.path(editor, selection)
          const point = Editor.point(editor, selection)
          const start = Editor.start(editor, path_c)
          const flag = Point.equals(start, point)

          //移动光标到 inline 节点里面
          flag && Transforms.select(editor, end_p)
        }
        if (isInline_n) {
          const start_n = Editor.start(editor, path_n)
          const path_c = Editor.path(editor, selection)
          const point = Editor.point(editor, selection)
          const end = Editor.end(editor, path_c)
          const flag = Point.equals(end, point)

          //移动光标到 inline 节点里面
          flag && Transforms.select(editor, start_n)
        }
      }
    }
  }

  return (
    <p data-tip={'p'} className={(isTypeTipOpen && focused && selected) ? 'tip' : ''} {...attributes}>
      {children}
    </p>
  )
}

export default Element
