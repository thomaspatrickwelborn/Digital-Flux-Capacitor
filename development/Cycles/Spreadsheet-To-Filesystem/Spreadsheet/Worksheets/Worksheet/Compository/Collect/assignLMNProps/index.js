import assignProps from './assignProps/index.js'
import assignPropPath from './assignPropPath/index.js'

async function assignLMNProps($collect, $settings) {
  var { mods, composits, lmnRanges } = $settings
  if(lmnRanges.length === 0) return $collect
  assignProps($collect, { mods, lmnRanges, composits })
  assignPropPath($collect, { mods, lmnRanges, composits })
  return $collect
}

export default assignLMNProps