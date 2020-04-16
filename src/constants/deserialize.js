import { jsx } from 'slate-hyperscript'
import unified from 'unified'
import markdown from 'remark-parse'

const deserialize = el => {
  let text = unified()
  .use(markdown)
  .use(plugin)
  .process(el)
  .then(function (file) {
    return file.result
  }, function (err) {
    console.error(String(err))
  })

  return text
}

function plugin() {
  this.Compiler = (node) => node.children.map(transform)

  function transform(node, index) {
    var children = [{ text: '' }]

    if (Array.isArray(node.children) && node.children.length > 0) {
      children = node.children.map(child => transform(child))
    }

    switch (node.type) {
      case 'heading':
        return jsx(
          'element',
          { type: depthToHeading[node.depth], id: 'h' + index },
          children,
        )
      case 'list':
        return jsx(
          'element',
          { type: 'bulleted-list' },
          children,
        )
      case 'listItem':
        return jsx(
          'element',
          { type: 'list-item' },
          children,
        )
      case 'thematicBreak':
        //mdast的thematicBreak没有保存原始字符
        //暂时通过计算模拟
        const number = node.position.end.offset - node.position.start.offset
        children = [{ text: '*'.repeat(number) }]

        return jsx(
          'element',
          { type: 'thematic-break' },
          children,
        )
      case 'inlineCode':
        children = [
          { type: 'punctuation', text: '`' },
          { type: 'text', text: node.value },
          { type: 'punctuation', text: '`' },
        ]

        return jsx(
          'element',
          { type: 'code' },
          children
        )
      case 'code':
        children = [{ text: node.value }]

        return jsx(
          'element',
          { type: 'fenced-code-blocks', lang: node.lang },
          children,
        )
      case 'image':
        children = [
          { type: 'punctuation', text: '!' },
          { type: 'punctuation', text: '[' },
          { type: 'text', text: node.alt },
          { type: 'punctuation', text: ']' },
          { type: 'punctuation', text: '(' },
          { type: 'punctuation', text: node.url },
          { type: 'punctuation', text: ')' },
          { type: 'image', url: node.url, children: [{ text: ''}] },
        ]

        return jsx(
          'element',
          { type: 'inline-box' },
          children,
        )
      case 'emphasis':
        children = [
          {type: 'punctuation', text: '*'},
          {type: 'text', text: children[0].text},
          {type: 'punctuation', text: '*'},
        ]

        return jsx(
          'element',
          { type: 'em' },
          children,
        )
      case 'strong':
        children = [
          {type: 'punctuation', text: '**'},
          {type: 'text', text: children[0].text},
          {type: 'punctuation', text: '**'},
        ]

        return jsx(
          'element',
          { type: 'strong' },
          children,
        )
      case 'paragraph':
        return jsx(
          'element',
          { type: 'paragraph' },
          children,
        )
      case 'link':
        children = [
          { type: 'punctuation', text: '[' },
          { type: 'inline-box', children: children},
          { type: 'punctuation', text: ']' },
          { type: 'punctuation', text: '(' },
          { type: 'punctuation', text: node.url },
          { type: 'punctuation', text: ')' },
        ]

        return jsx(
          'element',
          { type: 'link', url: node.url },
          children,
        )
      case 'blockquote':
        return jsx(
          'element',
          { type: 'block-quote' },
          children,
        )
      case 'text':
        return jsx('text', {}, node.value)
      default:
        return jsx('text', {}, node.value || '')
    }
  }

  const depthToHeading = {
    1: 'heading-one',
    2: 'heading-two',
    3: 'heading-three',
    4: 'heading-four',
    5: 'heading-five',
    6: 'heading-six',
  }
}


export default deserialize
