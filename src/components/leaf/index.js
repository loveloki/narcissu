import React from 'react'
import { useSelected, useFocused } from 'slate-react'

const Leaf = props => {
  const { attributes, children, leaf } = props
  const selected = useSelected()
  const focused = useFocused()

  const isMark = leaf.type === 'mark'
  const isActive = selected && focused

  return (
    <span
      style={{
        display: isMark && (isActive ? 'inline' : 'none'),
        color: isMark && (isActive ? '#f00' : '#000'),
      }}
      {...attributes}
    >
      {children}
    </span>
  )
}

export default Leaf
