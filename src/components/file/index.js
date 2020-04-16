import React from 'react'
import './index.css'
import deserialize from '../../constants/deserialize'
import { ReactEditor } from 'slate-react'

const File = props => {
  const { editor ,setValue } = props

  const onFileOpen = e => {
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
      }, error => {
        console.warn('打开文件失败', error)
      })
    }

    //file存在时再读取，避免多次快速打开文件然后取消产生的file未定义bug
    file && reader.readAsText(file)
  }

  const createNewFile = e => {
    const empty = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      }
    ]

    setValue(empty)
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
