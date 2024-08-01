import path from 'node:path'
import { EventEmitter } from 'node:events'
import { readFile, writeFile, rm } from 'node:fs/promises'
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
  #path($collectDoc) {
    return path.join(
      this.root.path,
      $collectDoc.fs.path
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
      file.path = this.#path(collectDoc)
      file.write = this.#render(collectDoc)
      file.read = await readFile(file.path)
      file.handle = await writeFile(
        file.path, 
        file.write
      )
    }
    return file
  }
  async update($collectDoc) {
    const file = {}
    var collectDoc = $collectDoc
    if(
      collectDoc.fs.type === 'File' &&
      collectDoc.fs.template !== undefined
    ) {
      file.path = this.#path(collectDoc)
      file.write = this.#render(collectDoc)
      file.read = await readFile(file.path)
      if(
        this.#readAndWriteFilesSame(
          file.read, file.write
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
  async delete($collectDoc) {
    const file = {}
    var collectDoc = $collectDoc
    const filePath = this.#path(collectDoc)
    await rm(filePath, {
      recursive: true,
      force: true,
    })
    return file
  }
}
