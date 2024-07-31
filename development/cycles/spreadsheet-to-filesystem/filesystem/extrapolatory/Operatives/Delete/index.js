import Operative from '../Operative/index.js'
export default class Update extends Operative {
  constructor($settings) {
    super($settings)
  }
  deleteFile($fileDoc) {
    console.log('$fileDoc', $fileDoc)
  }
  deleteFold($foldDoc) {
    console.log('$foldDoc', $foldDoc)

  }
}