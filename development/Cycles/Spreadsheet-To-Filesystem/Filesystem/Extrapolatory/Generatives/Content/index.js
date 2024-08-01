import { EventEmitter } from 'node:events'
import *  as Templates from './Templates/index.js'
export default class Content extends EventEmitter {
  #settings
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  file($collectDoc) {
    var collectDoc = $collectDoc
    if(
      collectDoc.fs.type === 'File' &&
      collectDoc.fs.template !== undefined
    ) {
      const templateModel = {
        content: collectDoc.toObject(),
        coutils: {
          Functions,
          Parsers,
          Operators,
          path,
        }
      }
      const filePath = path.join(
        filesystem.path,
        collectDoc.fs.path
      )
      const Template = Templates[
        collectDoc.fs.template
      ]
      if(Template) {
        const TemplateOptions = filesystemContent[
          collectDoc.fs.template
        ]
        const writeFileData = Template(templateModel, TemplateOptions)
        readFile(filePath, ($err, $readFileData) => {
          if($err) return
          if(writeFileData !== $readFileData) {
            writeFile(filePath, writeFileData, ($err) => {
              if($err) return
              console.log(
                '\n', '=====', 
                '\n', collectDoc.fs.template, filePath, 
                '\n', '#####',
                '\n', 'writeFileData', 
                '\n', writeFileData, 
              )
            })
          }
        })
      }
    }
  }
}
