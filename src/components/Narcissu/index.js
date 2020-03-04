import React, { useState, useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

import './index.css'

const Narcissu = () => {
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '随意输入。。。' }],
    },
  ])

  const editor = useMemo(() => withReact(withHistory(createEditor())), [])

  return (
    <main className='narcissu'>
      <Slate
        editor={editor}
        value={value}
        onChange={value => setValue(value)}
      >
        <Editable />
      </Slate>
    </main>
  )
}

export default Narcissu
