import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'


import Element from '../element'
import StorageManager from '../../constants/storage'
import withPlugins from '../../plugins'
import Settings from '../settings'
import Leaf from '../leaf'

import './index.css'
import defaultConfig from '../../constants/config'
import serialize from '../../constants/serializing'
import Side from '../side'

const Home = () => {
  const [value, setValue] = useState(StorageManager.get('value') || defaultValue)
  const [fileName, setFileName] = useState(StorageManager.get('fileName') || (new Date()).toLocaleDateString('zh'))

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

  useEffect(() => {
    StorageManager.set('fileName', fileName)
  }, [fileName])

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

  const onKeyDown = e => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()

      Transforms.insertText(editor, '\n')
    } else if(e.key === 's' && e.ctrlKey) {
      e.preventDefault()

      const md = serialize(value)
      const a = document.createElement('a')
      a.download = 'narcissu.md'
      const blob = new Blob([md], {
        type: 'text/markdown',
      })
      a.href = URL.createObjectURL(blob)
      a.click()
    }
  }

  return (
    <>
      <Side setValue={setValue} setFileName={setFileName} value={value} editor={editor} />
      <main className='main'>
        <header>
          <Link to='/settings'>
            <div className='icon-box'>
              <css-icon class="icon-menu"></css-icon>
            </div>
          </Link>
          <div className='file-name'>
            <input type="text" value={fileName} name="file-name" id="file-name" onChange={e => setFileName(e.target.value)}/>
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
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
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

const defaultValue = [
  { type: 'paragraph', children: [{ text: 'This is a Markdown editor.' }]},
  { type: 'paragraph', children: [{ text: '支持' }, { type: 'em', children: [ {type: 'punctuation', text: '*'}, {type: 'text', text: '倾斜'}, {type: 'punctuation', text: '*'},]}, { text: '支持' }, { type: 'strong', children: [ {type: 'punctuation', text: '**'}, {type: 'text', text: '强调'}, {type: 'punctuation', text: '**'},]}, { text: '支持' }, { type: 'code', children: [ {type: 'punctuation', text: '`'}, {type: 'text', text: 'code'}, {type: 'punctuation', text: '`'},]}, { text: '支持' }, { type: 'link', url: 'https://bing.com', children: [ {type: 'punctuation', text: '['}, {type: 'text', text: '链接'}, {type: 'punctuation', text: ']'},{type: 'punctuation', text: '('}, {type: 'punctuation', text: 'https://bing.com'}, {type: 'punctuation', text: ')'},]}, { text: '支持' }, { type: 'inline-box', children: [ {type: 'punctuation', text: '!'}, {type: 'punctuation', text: '['}, {type: 'text', text: '图片'}, {type: 'punctuation', text: ']'},{type: 'punctuation', text: '('}, {type: 'punctuation', text: 'https://fakeimg.pl/50/'}, {type: 'punctuation', text: ')'}, {type: 'image', url: 'https://fakeimg.pl/50/', children: [{ text: '' }]}]},]},
  { type: 'paragraph', children: [{ text: '还有。。。' }]},
  { type: 'heading-one', id: 'h3', children: [{ text: '标题h1~h6' }]},
  { type: 'paragraph', children: [{ text: '强制换行' }]},
  { type: 'thematic-break', children: [{ text: '******' }]},
  { type: 'fenced-code-blocks', lang: 'jsx', children: [{ text: '围栏代码块' }]},
  { type: 'block-quote', children: [{ type: 'paragraph', children: [{ text: '引用' }]}]},
  { type: 'bulleted-list', children: [{ type: 'list-item', children: [{ type: 'paragraph', children: [{ text: '列表' }]}]},]},
]

export default Narcissu
