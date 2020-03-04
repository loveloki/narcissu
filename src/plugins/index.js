//处理所有插件逻辑
import withShortcuts from './shortcuts'
import withDelete from './delete'

const PLUGINS = [withShortcuts, withDelete]

const withPlugins = editor => {
  return PLUGINS.reduce(
    (accumulator, currentValue) => currentValue(accumulator),
    editor
    )
}

export default  withPlugins
