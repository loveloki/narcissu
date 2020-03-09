import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

import Element from '../element'
import StorageManager from '../../constants/storage'
import withPlugins from '../../plugins'

import './index.css'

const Narcissu = () => {
  const [value, setValue] = useState(StorageManager.get('value') || [
    {
      type: 'paragraph',
      children: [{ text: '随意输入。。。' }],
    },
  ])

  const renderElement = useCallback(props => <Element {...props} />, [])

  const editor = useMemo(() => withPlugins(withReact(withHistory(createEditor()))), [])

  useEffect(() => {
    StorageManager.set('value', value)
  }, [value])

  const clickSideArrow = (event) => {
    const arrow = event.target.firstChild
    const className = arrow.className

    //改变箭头方向
    if (className === 'icon-arrow-left') {
      event.target.firstChild.className = 'icon-arrow-right'

      //隐藏侧边栏
      const side = document.querySelector('.side')
      side.style.display = 'none'
      document.querySelector(".main").classList.add('close-side')
    } else {
      event.target.firstChild.className = 'icon-arrow-left'
      //显示侧边栏
      const side = document.querySelector('.side')
      side.style.display = 'block'
      document.querySelector(".main").classList.remove('close-side')
    }
  }

  return (
    <>
      <div className='side'>
        <div className='content'>
        </div>
      </div>
      <main className='main'>
        <header>
          <div className='icon-box'>
            <css-icon class="icon-menu"></css-icon>
          </div>
        </header>
        <main className='narcissu'>
          <Slate
            editor={editor}
            value={value}
            onChange={value => setValue(value)}
          >
            <Editable
              renderElement={renderElement}
            />
          </Slate>
        </main>
        <footer>
          <div className='icon-box' onClick={clickSideArrow}>
            <css-icon class="icon-arrow-left"></css-icon>
          </div>
        </footer>
      </main>
    </>
  )
}

export default Narcissu
