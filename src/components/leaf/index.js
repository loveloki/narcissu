import React from 'react'

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

const Leaf = props => {
  switch (props.leaf.type) {
    case 'em':
      return <Em {...props}/>
    case 'strong':
      return <Strong {...props}/>
    default:
      return <Default {...props}/>
  }
}

export default Leaf
