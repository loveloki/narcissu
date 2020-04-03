//处理所有插件逻辑
import withShortcuts from './shortcuts'
import withDelete from './delete'
import withInsertBreak from './insertBreak'
import withSpecial from './special'
import withNormalizing from './normalizing'

const PLUGINS = [withShortcuts, withDelete, withInsertBreak, withSpecial, withNormalizing]

const withPlugins = editor => {
  return PLUGINS.reduce(
    (accumulator, currentValue) => currentValue(accumulator),
    editor
    )
}

export default  withPlugins
