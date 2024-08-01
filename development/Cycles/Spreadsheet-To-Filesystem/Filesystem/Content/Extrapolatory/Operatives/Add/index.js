import Operative from '../Operative/index.js'
import { stat, mkdir, writeFile } from 'node:fs/promises'
export default class Add extends Operative {
  constructor($settings) {
    super($settings)
  }
  async file($fileDoc) {
    const fileDocPath = path.join(
      this.root.path,
      $fileDoc.fs.path,
    )
    const fileDirPath = path.dirname(fileDocPath)
    const fileDirStat = await stat(fileDirPath)
    if(fileDirStat.isDirectory() === false) {
      await mkdir(fileDirPath, {
        recursive: true,
      })
      // this.emit('addFile', $fileDoc)
    } else {
      await writeFile(fileDocPath, '', ($err, $file) => {
        if($err) return
        // this.emit('addFile', $fileDoc)
      })
    }
    return 
  }
  async fold($foldDoc) {
    const foldDocPath = path.join(
      this.root.path,
      $foldDoc.fs.path,
    )
    await mkdir(foldDocPath, {
      recursive: true,
    })
    // this.emit('addFold', $foldDoc)
    return $foldDoc
  }
}