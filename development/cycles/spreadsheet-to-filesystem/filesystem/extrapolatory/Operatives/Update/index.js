import Operative from '../Operative/index.js'
export default class Update extends Operative {
  constructor($settings) {
    super($settings)
  }
  updateFile($fileDoc) {
    console.log('$fileDoc', $fileDoc)
  }
  updateFold($foldDoc) {
    console.log('$foldDoc', $foldDoc)

  }
}