//处理所有插件逻辑
const PLUGINS = []

const withPlugins = editor => {
  return PLUGINS.reduce(
    (accumulator, currentValue) => currentValue(accumulator),
    editor
    )
}

export default  withPlugins
