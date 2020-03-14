//处理返回不同元素
import React from 'react'
import './index.css'
import { useSelected, useFocused } from 'slate-react'
import StorageManager from '../../constants/storage'

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
    default:
      return <LeafBlocks {...props} type={'p'} isTypeTipOpen={isTypeTipOpen} />
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
    <pre className={(isTypeTipOpen && focused && selected) ? 'tip tipCode' : ''} data-tip={'code'}>
      <code {...attributes} className={ 'language-' + lang}>{children}</code>
    </pre>
  )
}

export default Element
