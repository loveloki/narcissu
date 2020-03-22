import React from 'react'
import { useSelected, useFocused } from 'slate-react'

const Leaf = props => {
  const { attributes, children, leaf } = props
  const selected = useSelected()
  const focused = useFocused()

  const isPunctuation = leaf.type === 'punctuation'
  const isActive = selected && focused

  return (
    <span
      style={{
        display: isPunctuation && (isActive ? 'inline' : 'none'),
        color: isPunctuation && (isActive ? '#f00' : '#000'),
      }}
      {...attributes}
    >
      {children}
    </span>
  )
}

export default Leaf
