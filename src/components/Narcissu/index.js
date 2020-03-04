import React, { useState, useMemo, useCallback } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

import Element from '../element'

import './index.css'

const Narcissu = () => {
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '随意输入。。。' }],
    },
  ])

  const renderElement = useCallback(props => <Element {...props} />, [])

  const editor = useMemo(() => withReact(withHistory(createEditor())), [])

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
