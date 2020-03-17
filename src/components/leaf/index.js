import React from 'react'
import { Editor } from 'slate'

const Em = props => {
  return (
    <em>
      <span {...props.attributes}>
        {props.children}
      </span>
    </em>
  )
}
const Strong = props => {
  return (
    <strong>
      <span {...props.attributes}>
        {props.children}
      </span>
    </strong>
  )
}
const Default = props => {
  return (
    <span {...props.attributes}>
      {props.children}
    </span>
  )
}

const Link = props => {
  const { leaf,  attributes, children } = props
  const text = [{ text: leaf.match[1] }]
  const url = leaf.match[2]

  const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, { match: n => n.type === 'link' })
    return !!link
  }


  return (
    <a {...attributes} href={url}>
      {children}
    </a>
  )
}

const Leaf = props => {
  switch (props.leaf.type) {
    case 'link':
      return <Link {...props}/>
    case 'em':
      return <Em {...props}/>
    case 'strong':
      return <Strong {...props}/>
    default:
      return <Default {...props}/>
  }
}

export default Leaf
