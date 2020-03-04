//处理所有插件逻辑
import withShortcuts from './shortcuts'
const PLUGINS = [withShortcuts]

const withPlugins = editor => {
  return PLUGINS.reduce(
    (accumulator, currentValue) => currentValue(accumulator),
    editor
    )
}

export default  withPlugins
