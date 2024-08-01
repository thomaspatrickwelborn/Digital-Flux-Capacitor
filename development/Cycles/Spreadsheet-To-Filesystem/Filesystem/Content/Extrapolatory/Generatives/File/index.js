import path from 'node:path'
import { EventEmitter } from 'node:events'
import { readFile, writeFile } from 'node:fs/promises'
import *  as Templates from './Templates/index.js'
import { Functions, Parsers, Operators } from './Coutil/index.js'
export default class Generatives extends EventEmitter {
  #settings
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get root() { return this.#settings.root }
  get content() { return this.#settings.content }
  #render($collectDoc) {
    const templateModel = {
      content: $collectDoc,
      coutils: {
        Functions,
        Parsers,
        Operators,
        path,
      }
    }

    const Template = Templates[
      $collectDoc.fs.template
    ]
    if(Template) {
      const TemplateOptions = this.#settings.content[
        $collectDoc.fs.template
      ]
      return Template(templateModel, TemplateOptions)
    }
    return ''
  }
  #renderPath($collectDoc) {
    return path.join(
      this.root.path,
      collectDoc.fs.path
    )
  }
  #readAndWriteFilesSame($readFile, $writeFile) {
    return $readFile === $writeFile
  }
  async add($collectDoc) {
    const file = {}
    var collectDoc = $collectDoc
    if(
      collectDoc.fs.type === 'File' &&
      collectDoc.fs.template !== undefined
    ) {
      file.path = this.#renderPath(collectDoc)
      file.write = this.#render(collectDoc)
      file.read = await readFile(file.path)
      if(
        this.#readAndWriteFilesSame(
          file.write, file.read
        ) === false
      ) {
        file.handle = await writeFile(
          file.path, 
          file.write
        )
      }
    }
    return file
  }
  async update() {}
  async delete() {}
}
