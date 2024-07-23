import Diff from './diff/index.js'
import Elements from './elements/index.js'
export default async function Added($collection, $fsRootPath, $fsRoot, $fsVine) {
  const diff = Diff($fsRoot, $fsVine)
  const elements = new Elements($collection, $fsRootPath, diff)
  elements.on('added', ($data) => {
    console.log($data)
  })
  return {
    diff, elements
  }
}