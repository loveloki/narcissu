import React from 'react'
import Catalog from '../catalog'
import StorageManager from '../../constants/storage'

const getCatalog = valueArray => {
  const catalog = []
  valueArray.forEach(node => {
    node.type.includes('heading') && catalog.push(node)
  })

  return catalog
}

const Side = props => {
  const { value } = props

  const config = StorageManager.all()

  return (
    <div className={(() => {
      const close = config.sideIsClose ? 'side side-is-close' : 'side'
      const position = config.sidePosition === 'left' ? 'side-position-left' : 'side-position-right'
      return close + " " + position
      })()}>
      <div className='content'>
        <Catalog catalogArray={getCatalog(value)} />
      </div>
    </div>
  )
}

export default Side
