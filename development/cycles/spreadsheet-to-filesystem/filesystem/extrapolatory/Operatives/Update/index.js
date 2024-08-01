import Operative from '../Operative/index.js'
export default class Update extends Operative {
  constructor($settings) {
    super($settings)
  }
  file($fileDoc) {
    console.log('$fileDoc', $fileDoc)
  }
  fold($foldDoc) {
    console.log('$foldDoc', $foldDoc)

  }
}