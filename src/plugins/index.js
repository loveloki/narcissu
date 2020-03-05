//处理所有插件逻辑
import withShortcuts from './shortcuts'
import withDelete from './delete'
import withInsertBreak from './insertBreak'

const PLUGINS = [withShortcuts, withDelete, withInsertBreak]

const withPlugins = editor => {
  return PLUGINS.reduce(
    (accumulator, currentValue) => currentValue(accumulator),
    editor
    )
}

export default  withPlugins
