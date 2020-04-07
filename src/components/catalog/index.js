import React from 'react'
import { Node } from 'slate'
import './index.css'

const Catalog = props => {
  const { catalogArray } = props

  const list = {
    children: [],
  }
  const getLevel = text => {
    switch (text) {
      case 'heading-one':
        return 1
      case 'heading-two':
        return 2
      case 'heading-three':
        return 3
      case 'heading-four':
        return 4
      case 'heading-five':
        return 5
      case 'heading-six':
        return 6
      default:
        break;
    }
  }

  let last = list
  for (let i = 0; i < catalogArray.length; i++) {
    const node = catalogArray[i]

    const title = {
      text: Node.string(node),
      level: getLevel(node.type),
      id: node.id,
      parent: null,
      children: [],
    }

    if (i === 0) {
      title.parent = list
      last.children.push(title)

      last = last.children[last.children.length - 1]
    } else {
      while (title.level < last.level) {
        last = last.parent
      }

      if(title.level > last.level) {
        title.parent = last
        last.children.push(title)

        last = last.children[last.children.length - 1]
      } else if (title.level === last.level) {
        title.parent = last.parent
        last.parent.children.push(title)

        last = last.parent.children[last.parent.children.length - 1]
      }
    }
  }

  const renderUl = (list) => {
    const level = list.children[0].level
    const onClick = e => {
      e.preventDefault()
      const id = e.target.dataset.id
      const heading = document.querySelector('#' + id)

      window.scrollTo({
        behavior: 'smooth',
        top: heading.offsetTop - 50,
      })
    }

    return (
      <ul className={'ul-' + level}>
        {list.children
        && list.children.map((node, index) => {
          const { text, children, id } = node

          return (
            <li key={index}>
              <div onClick={onClick} data-id={id}>{text}</div>
              {!!children.length && renderUl({children})}
            </li>
          )
        })}
      </ul>
    )

  }

  return (
    <nav className='catalog'>
      <div>目录</div>
      {list.children.length > 0 && renderUl(list)}
    </nav>
  )
}

export default Catalog
