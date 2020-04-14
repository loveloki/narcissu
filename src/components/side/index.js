import React from 'react'
import Catalog from '../catalog'
import StorageManager from '../../constants/storage'
import { useState } from 'react'
import './index.css'

const getCatalog = valueArray => {
  const catalog = []
  valueArray.forEach(node => {
    node.type.includes('heading') && catalog.push(node)
  })

  return catalog
}

const Side = props => {
  const [title, setTitle] = useState('file')
  const { value } = props

  const config = StorageManager.all()

  return (
    <div className={(() => {
      const close = config.sideIsClose ? 'side side-is-close' : 'side'
      const position = config.sidePosition === 'left' ? 'side-position-left' : 'side-position-right'
      return close + " " + position
      })()}>
      <nav className='title'>
        <span onClick={e => setTitle('file')}>文件</span>
        <span onClick={e => setTitle('catalog')}>目录</span>
      </nav>
      <div className='content'>
        {title === 'catalog'
        ? <Catalog catalogArray={getCatalog(value)} />
        : <div>file</div>
        }
      </div>
    </div>
  )
}

export default Side
