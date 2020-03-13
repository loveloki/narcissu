import React from 'react'
import { Link } from 'react-router-dom'

import './index.css'
import StorageManager from '../../constants/storage'

const Settings = () => {
  const handleClick =(event) => {
    if(event.target.tagName !== 'BUTTON') {
      return
    }

    const self = event.target
    const parent = self.parentElement
    const allButton = parent.querySelectorAll('button')

    const key = parent.getAttribute('data-key')
    const value = self.getAttribute('data-value')

    allButton.forEach(btn => {
      if (btn !== self) {
        btn.classList.remove('active')
      } else {
        btn.classList.add('active')

        //getAttribute获取到的是字符串，加入判断是否存入boolean
        if (value === 'true' || value === 'false') {
          StorageManager.set(key, JSON.parse(value))
        } else {
          StorageManager.set(key, value)
        }
      }
    })
  }

  const isActive = (key, value) => {
    const result = StorageManager.get(key)

    if (result === value) {
      return 'active'
    }

    return ''
  }

  return (
    <main className='settings'>
      <Link to="/" style={{fontSize: '34px'}}>back home</Link>
      <div className='config' onClick={handleClick} data-key='sidePosition'>
        <div className='title'>
          <p>侧边栏位置</p>
        </div>
        <button type='button' className={'btn setting-2-1 ' + isActive('sidePosition', 'left')} data-value='left'>左侧</button>
        <button type='button' className={'btn setting-2-2 ' + isActive('sidePosition', 'right')} data-value='right'>右侧</button>
      </div>
      <div className='config' onClick={handleClick} data-key='isTypeTipOpen'>
        <div className='title'>
          <p>类型提示</p>
        </div>
        <button type='button' className={'btn setting-2-1 ' + isActive('isTypeTipOpen', false)} data-value='false'>关闭</button>
        <button type='button' className={'btn setting-2-2 ' + isActive('isTypeTipOpen', true)} data-value='true'>开启</button>
      </div>
    </main>
  )
}

export default Settings
