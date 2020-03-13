//处理返回不同元素
import React from 'react'
import './index.css'
import { useSelected, useFocused } from 'slate-react'

const typeList = {
  'heading-one' : 'h1',
  'heading-two' : 'h2',
  'heading-three' : 'h3',
  'heading-four' : 'h4',
  'heading-five' : 'h5',
  'heading-six' : 'h6',
  'thematic-break': 'hr',
}

const Element = props => {
  const { attributes, children, element } = props
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
      return <LeafBlocks {...props} type={typeList[element.type]} />
    case 'block-quote':
      return <blockquote data-tip={'quote'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul data-tip={'ul'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</ul>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <LeafBlocks {...props} type={'p'} />
  }
}

const LeafBlocks = props => {
  const { attributes, children, type } = props
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
  }

  return <Type data-tip={type} className={(focused && selected) ? 'tip' + adjustClassName : ''} {...attributes}>{children}</Type>
}

const ThematicBreak = props => {
  const { attributes, children, selected, focused } = props

  return (
    <div {...attributes} className='block'>
      <div contentEditable={false}>
        <hr
          className={(focused && selected) ? 'tip tipHr' : ''}
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

export default Element
