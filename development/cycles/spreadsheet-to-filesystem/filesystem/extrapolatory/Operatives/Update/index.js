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
  update($fileDoc) {
    switch($fileDoc.fs.type) {
      case 'File':
        this.updateFile($fileDoc)
        break
      case 'Fold':
        this.updateFold($fileDoc)
        break
    }
    return $fileDoc
  }

}