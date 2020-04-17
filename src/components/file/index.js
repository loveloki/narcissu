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

    StorageManager.set('files', files)
  }

  const onFileOpen = e => {
    saveFile()
    
    //保存完进入新的文件
    StorageManager.set('loadFile', false)


    //取消编辑器的选择，如果有选择可能会导致渲染后存在找不到路径的问题
    ReactEditor.deselect(editor)

    var file = e.target.files[0]
    var reader = new FileReader()
    reader.onload = async function(e) {
      console.log('file read')

      const markdown = e.target.result
      const newValue = deserialize(markdown)

      newValue.then(result => {
        setFileName((new Date()).toLocaleDateString('zh'))
        setValue(result)
        window.scrollTo({
          behavior: 'smooth',
          top: 0,
        })
      }, error => {
        console.warn('打开文件失败', error)
      })
    }

    //file存在时再读取，避免多次快速打开文件然后取消产生的file未定义bug
    file && reader.readAsText(file)
  }

  const createNewFile = e => {
    saveFile()

    //设置loadFile
    StorageManager.set('loadFile', false)

    const empty = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      }
    ]

    setFileName((new Date()).toLocaleDateString('zh'))
    setValue(empty)
  }

  const loadFile = (name, value) => {
    saveFile()

    StorageManager.set('loadFile', name)

    setFileName(name)
    setValue(value)
  }

  const files = StorageManager.get('files')

  return (
    <div className='file'>
      <div><span className='new' onClick={createNewFile}>新建</span></div>
      <div>
        <input type="file" accept='.md' onChange={onFileOpen} name="open-file" id="open-file"/>
        <label htmlFor='open-file' className='open'>打开</label>
      </div>
      <div className='file-history'>
        <span>已保存文件</span>
        {files &&
        Object.entries(files).map(([name, value]) => <div key={name} ><span onClick={e => loadFile(name, value)}>{name}</span></div>)
        }
      </div>
    </div>
  )
}

export default File
