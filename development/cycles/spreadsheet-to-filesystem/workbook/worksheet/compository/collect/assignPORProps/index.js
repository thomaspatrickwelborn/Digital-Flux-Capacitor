import assignProps from './assignProps.js'
import transformCollectDoc from './transformCollectDoc.js'

async function assignPORProps($collect, $settings) {
  var { mods, composits, lmnRanges } = $settings
  if(lmnRanges.length === 0) return $collect
  assignProps($collect, { mods, lmnRanges, composits })
  transformCollectDoc($collect, { mods, lmnRanges, composits })
  return $collect
}

export default assignPORProps