import Operative from '../Operative/index.js'
export default class Add extends Operative {
  constructor($settings) {
    super($settings)
  }
  addFile($fileDoc) {
    console.log('$fileDoc', $fileDoc)
    const addedFileDocPath = path.join(
      this.root.path,
      $fileDoc.fs.path,
    )
    const addedFileDirPath = path.dirname(addedFileDocPath)
    stat(addedFileDirPath, (
      $err, $addedFileDirStat
    ) => {
      if($addedFileDirStat.isDirectory() === false) {
        mkdir(addedFileDirPath, {
          recursive: true,
        }, ($err, $dir) => {
          writeFile(addedFileDocPath, '', ($err, $file) => {
            // console.log($err, $file)
            if($err) return
            // this.emit('addFile', $fileDoc)
          })
        })
      } else {
        writeFile(addedFileDocPath, '', ($err, $file) => {
          // console.log($err, $file)
          if($err) return
          // this.emit('addFile', $fileDoc)
        })
      }
    })
  }
  addFold($foldDoc) {
    console.log('$foldDoc', $foldDoc)
    const addedFoldDocPath = path.join(
      this.root.path,
      $foldDoc.fs.path,
    )
    mkdir(addedFoldDocPath, {
      recursive: true,
    }, ($err, $dir) => {
      // console.log($err, $dir)
      if($err) return
      // this.emit('addFold', $foldDoc)
    })
  }
  add(fileDoc) {
    switch(fileDoc.fs.type) {
      case 'File':
        this.addFile(fileDoc)
        break
      case 'Fold':
        this.addFold(fileDoc)
        break
    }
    return fileDoc
  }
}