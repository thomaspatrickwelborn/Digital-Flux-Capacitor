import Diff from './diff/index.js'
import Elements from './elements/index.js'
export default async function Added($collection, $fsRootPath, $fsRoot, $fsVine) {
  const diff = Diff($fsRoot, $fsVine)
  const elements = await Elements($collection, $fsRootPath, diff)
  return {
    diff, elements
  }
}