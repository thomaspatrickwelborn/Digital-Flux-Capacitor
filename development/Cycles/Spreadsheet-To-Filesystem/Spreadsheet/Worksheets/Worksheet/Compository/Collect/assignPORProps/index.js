import assignProps from './assignProps/index.js'

async function assignPORProps($collect, $settings) {
  var { mods, composits, lmnRanges } = $settings
  if(lmnRanges.length === 0) return $collect
  assignProps($collect, { mods, lmnRanges, composits })
  return $collect
}

export default assignPORProps