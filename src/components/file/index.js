import React from 'react'
import './index.css'
import deserialize from '../../constants/deserialize'
import { ReactEditor } from 'slate-react'
import StorageManager from '../../constants/storage'

const File = props => {
  const { editor ,setValue, setFileName } = props

  const saveFile = () => {
    //把文件保存起来
    let name = StorageManager.get('fileName')
    const value = StorageManager.get('value')

    //加载的文件名
    const loadFile = StorageManager.get('loadFile')

    const files = StorageManager.get('files') || {}

    //如果是读取的文件
    if (loadFile) {
      //如果改名了
      name !== loadFile && delete files[loadFile]
    } else {
      //否则是新建的文件
      //判断是不是存在重名
      while (name === null || files[name]) {
          name = window.prompt('请重新输入保存的文件名！', name)
      }
    }

    files[name] = value
    console.log(files)

    StorageManager.set('files', files)
  }

  const onFileOpen = e => {
    //保存完进入新的文件
    StorageManager.set('loadFile', false)

    saveFile()

    //取消编辑器的选择，如果有选择可能会导致渲染后存在找不到路径的问题
    ReactEditor.deselect(editor)

    var file = e.target.files[0]
    var reader = new FileReader()
    reader.onload = async function(e) {
      console.log('file read')

      const markdown = e.target.result
      const newValue = deserialize(markdown)

      newValue.then(result => {
        setValue(result)
        window.scrollTo({
          behavior: 'smooth',
          top: 0,
        })
        setFileName((new Date()).toLocaleDateString('zh'))
      }, error => {
        console.warn('打开文件失败', error)
      })
    }

    //file存在时再读取，避免多次快速打开文件然后取消产生的file未定义bug
    file && reader.readAsText(file)
  }

  const createNewFile = e => {
    //设置loadFile
    StorageManager.set('loadFile', false)

    saveFile()

    const empty = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      }
    ]

    setValue(empty)
    setFileName((new Date()).toLocaleDateString('zh'))
  }

  return (
    <div className='file'>
      <div><span className='new' onClick={createNewFile}>新建</span></div>
      <div>
        <input type="file" accept='.md' onChange={onFileOpen} name="open-file" id="open-file"/>
        <label htmlFor='open-file' className='open'>打开</label>
      </div>
    </div>
  )
}

export default File
