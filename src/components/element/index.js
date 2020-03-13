//处理返回不同元素
import React from 'react'
import './index.css'
import { useSelected, useFocused } from 'slate-react'

const Element = props => {
  const { attributes, children, element } = props
  const selected = useSelected()
  const focused = useFocused()

  switch (element.type) {
    case 'block-quote':
      return <blockquote data-tip={'quote'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul data-tip={'ul'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 data-tip={'h1'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 data-tip={'h2'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 data-tip={'h3'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 data-tip={'h4'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 data-tip={'h5'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 data-tip={'h6'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'thematic-break':
      return <ThematicBreak { ...props } />
    default:
      return <p data-tip={'p'} className={(focused && selected) ? 'tip' : ''} {...attributes}>{children}</p>
  }
}

const ThematicBreak = ({ attributes, children }) => {
  const selected = useSelected()
  const focused = useFocused()

  return (
    <div {...attributes} className='block'>
      <div contentEditable={false}>
        <hr
          className={(focused && selected) ? 'tip hrTip' : ''}
          style={
            { boxShadow: (selected && focused) ? '0 0 0 3px #B4D5FF' : 'none'}
          }
          data-tip={'hr'}
          />
      </div>
      {children}
    </div>
  )

}

export default Element
