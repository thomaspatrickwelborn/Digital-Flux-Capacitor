import Operative from '../Operative/index.js'
import { mkdir, writeFile } from 'node:fs'
export default class Add extends Operative {
  constructor($settings) {
    super($settings)
  }
  file($fileDoc) {
    console.log('$fileDoc', $fileDoc)
    const fileDocPath = path.join(
      this.root.path,
      $fileDoc.fs.path,
    )
    const fileDirPath = path.dirname(fileDocPath)
    stat(fileDirPath, (
      $err, $fileDirStat
    ) => {
      if($fileDirStat.isDirectory() === false) {
        mkdir(fileDirPath, {
          recursive: true,
        }, ($err, $dir) => {
          writeFile(fileDocPath, '', ($err, $file) => {
            // console.log($err, $file)
            if($err) return
            // this.emit('addFile', $fileDoc)
          })
        })
      } else {
        writeFile(fileDocPath, '', ($err, $file) => {
          // console.log($err, $file)
          if($err) return
          // this.emit('addFile', $fileDoc)
        })
      }
    })
  }
  fold($foldDoc) {
    console.log('$foldDoc', $foldDoc)
    const foldDocPath = path.join(
      this.root.path,
      $foldDoc.fs.path,
    )
    mkdir(foldDocPath, {
      recursive: true,
    }, ($err, $dir) => {
      // console.log($err, $dir)
      if($err) return
      // this.emit('addFold', $foldDoc)
    })
  }
}