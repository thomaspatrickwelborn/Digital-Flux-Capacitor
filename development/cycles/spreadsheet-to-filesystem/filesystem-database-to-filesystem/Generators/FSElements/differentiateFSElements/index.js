import addedDiff from './addedDiff/index.js'
import updatedDiff from './updatedDiff/index.js'
import deletedDiff from './deletedDiff/index.js'

function differentiateFSElements($setA, $setB) {
  return {
    added: addedDiff($setA, $setB),
    updated: updatedDiff($setA, $setB),
    deleted: deletedDiff($setA, $setB),
  }
}

export default differentiateFSElements