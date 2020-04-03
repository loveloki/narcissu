import { Editor, Range, Path } from "slate"

const PathHelper = {
  ...Path,
  selfAndParentAllPrevious: (path, self = false) => {
    const list = []

    self && list.push(path)

    for (let i = 0; i < path.length; i++) {
      const last = path[path.length - i]
      for (let j = 0; j < last; j++) {
        list.push(path.slice(0, -i).concat(last - 1 - j))
      }
    }

    return list
  },
}

const EditorHelper = {
  ...Editor,
  findPoint: (editor, offset) => {
    const path = Editor.path(editor, editor.selection)

    const allPrevious = PathHelper.selfAndParentAllPrevious(path, true).reverse()

    let flag = offset
    const point = {}
    for (const path of allPrevious) {
      const string = Editor.string(editor, path)

      if (flag > string.length) {
        flag -= string.length
      } else {
        point.path = path
        point.offset = flag
        break
      }
    }

    return point
  },
  findOffset: (editor, at) => {
    const range = Editor.range(editor, at)
    const start = Range.start(range)

    let offset = start.offset

    const allPrevious = PathHelper.selfAndParentAllPrevious(start.path)
    for (const path of allPrevious) {
      const string = Editor.string(editor, path)

      offset += string.length
    }

    return offset
  },
}

export {
  PathHelper,
  EditorHelper
}
