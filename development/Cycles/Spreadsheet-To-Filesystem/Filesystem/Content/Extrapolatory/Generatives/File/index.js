import { Timer } from '#Coutil/index.js'
import path from 'node:path'
import { EventEmitter } from 'node:events'
import { readFile, writeFile, rm } from 'node:fs/promises'
import *  as Templates from './Templates/index.js'
import { Functions, Parsers, Operators } from './Coutil/index.js'
export default class File extends EventEmitter {
  #settings
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get #templates() { return this.#settings.templates }
  #render($collectDoc) {
    const templateModel = {
      content: $collectDoc.content,
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
      const TemplateOptions = this.#templates[
        $collectDoc.fs.template
      ]
      return Template(templateModel, TemplateOptions)
    }
    return ''
  }
  #path($collectDoc) {
    return path.join(
      this.#settings.root.path,
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
      file.read = file.read.toString()
      if(
        this.#readAndWriteFilesSame(
          file.read, file.write
        ) === false
      ) {
        await writeFile(
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
