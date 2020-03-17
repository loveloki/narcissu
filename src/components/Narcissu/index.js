import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'


import Element from '../element'
import StorageManager from '../../constants/storage'
import withPlugins from '../../plugins'
import Settings from '../settings'

import './index.css'
import defaultConfig from '../../constants/config'
import Leaf from '../leaf'

const Home = () => {
  const [value, setValue] = useState(StorageManager.get('value') || [
    {
      type: 'paragraph',
      children: [{ text: '随意输入。。。' }],
    },
  ])

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const editor = useMemo(() => withPlugins(withReact(withHistory(createEditor()))), [])

  //检查是否初始化
  const initialized = StorageManager.get('initialized')
  if (!initialized) {
    for (const key in defaultConfig) {
      if (defaultConfig.hasOwnProperty(key)) {
        const value = defaultConfig[key]

        StorageManager.set(key, value)
      }
    }
  }

  const config = StorageManager.all()

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
      side.classList.add('side-is-close')
      document.querySelector(".main").classList.add('close-side')

      StorageManager.set('sideIsClose', true)
    } else {
      event.target.firstChild.className = 'icon-arrow-left'
      //显示侧边栏
      const side = document.querySelector('.side')
      side.classList.remove('side-is-close')
      document.querySelector(".main").classList.remove('close-side')

      StorageManager.set('sideIsClose', false)
    }
  }


  return (
    <>
      <div className={(() => {
        const close = config.sideIsClose ? 'side side-is-close' : 'side'
        const position = config.sidePosition === 'left' ? 'side-position-left' : 'side-position-right'
        return close + " " + position
        })()}>
        <div className='content'>
        </div>
      </div>
      <main className='main'>
        <header>
          <Link to='/settings'>
            <div className='icon-box'>
              <css-icon class="icon-menu"></css-icon>
            </div>
          </Link>
        </header>
        <main className='narcissu'>
          <Slate
            editor={editor}
            value={value}
            onChange={value => setValue(value)}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
            />
          </Slate>
        </main>
        <footer>
          <div className='icon-box' onClick={clickSideArrow}>
            <css-icon class={config.sideIsClose ? "icon-arrow-right" : "icon-arrow-left"}></css-icon>
          </div>
        </footer>
      </main>
    </>
  )
}

const Narcissu = () => {
  return (
    <Router>
      <Switch>
        <Route path='/settings' component={Settings} />
        <Route path='/' component={Home} />
      </Switch>
    </Router>
  )
}

export default Narcissu
