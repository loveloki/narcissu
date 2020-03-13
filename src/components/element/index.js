//处理返回不同元素
import React from 'react'
import './index.css'
import { useSelected, useFocused } from 'slate-react'

const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'thematic-break':
      return <ThematicBreak { ...props } />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const ThematicBreak = ({ attributes, children }) => {
  const selected = useSelected()
  const focused = useFocused()

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <hr style={
          { boxShadow: (selected && focused) ? '0 0 0 3px #B4D5FF' : 'none'}
        } />
      </div>
      {children}
    </div>
  )

}

export default Element
