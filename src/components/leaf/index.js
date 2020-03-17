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
    default:
      return <Default {...props}/>
  }
}

export default Leaf
