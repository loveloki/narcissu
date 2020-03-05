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

  return (
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
  )
}

export default Narcissu
