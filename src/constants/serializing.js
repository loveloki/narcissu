//转换为markdown
import { Node } from "slate"

const serialize = nodes => {

  const convert = node => {
    const { type } = node
    switch (type) {
      case 'paragraph':
        return Node.string(node)
      case 'heading-one':
        return '# ' + Node.string(node)
      case 'heading-two':
        return '## ' + Node.string(node)
      case 'heading-three':
        return '### ' + Node.string(node)
      case 'heading-four':
        return '#### ' + Node.string(node)
      case 'heading-five':
        return '###### ' + Node.string(node)
      case 'heading-six':
        return '####### ' + Node.string(node)
      case 'thematic-break':
        return Node.string(node)
      case 'fenced-code-blocks':
        const { lang } = node
        const mark = '```'

        return `${mark}${lang}
${Node.string(node)}
${mark}`

      default:
        return ''
    }
  }

  const parser = node => {
    switch (node.type) {
      case 'block-quote':
        return parseQuote(node)
      case 'bulleted-list':
        return parseList(node)
      default:
        return convert(node)
    }
  }

  const parseList = (node, deep = 0, first = false, pre = '') => {
    const children = node.children
    node.type === 'bulleted-list' && deep++

    if (children) {
      return children.map(child => {
        switch (child.type) {
          case 'bulleted-list':
            return parseList(child, deep, first, pre)
          case 'list-item':
            return parseList(child, deep, true, pre)
          default:
            if (first) {
              first = false

              return pre +  '    '.repeat(deep - 1) + '- ' + convert(child)
            }
            return pre + '    '.repeat(deep) + convert(child)
        }
      }).join('\n')
    }
  }

  const parseQuote = (node, deep = 0) => {
    const children = node.children
    deep++

    if (children) {
      return children.map(child => {
        switch (child.type) {
          case 'block-quote':
            return parseQuote(child, deep)
          case 'bulleted-list':
            //结束要用两个`\n``，因为是在内部调用所以只有一个，需要手动再添加一个
            return parseList(child, 0, false, '>'.repeat(deep) + ' ') + '\n>>'
          default:
            return '>'.repeat(deep) + ' ' + convert(child)
        }
      }).join('\n')
    }
  }

  return nodes.map(node => parser(node)).join('\n\n')
}

export default serialize
