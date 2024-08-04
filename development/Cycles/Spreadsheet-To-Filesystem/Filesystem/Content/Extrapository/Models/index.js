import FSElement from './FSElement/index.js'
import FSElementContent from './FSElementContent/index.js'

export default class Models {
  constructor() {
    // 
  }
  get fsElement() {
    if(this.#_fsElement === undefined) {
      this.#_fsElement = new FSElement({
        models: this.#models
      })
    }
  }
  get fsElementContent() {
    if(this.#_fsElementContent === undefined) {
      this.#_fsElementContent = new FSElementContent({
        models: this.#models
      })
    }
  }
  get #models() {
    if(this.#_models === undefined) {
      this.#_models = {}
      const modelNames = ['FSElement']
      for(const [
        $schemaName, $schema
      ] of Object.entries(Schemata)) {
        let model
        if(
          this.#database
          .models[$schemaName] === undefined
        ) {
          model = this.#database.model(
            $schemaName, 
            $schema
          )
        } else {
          model = this.#database.models.models
        }
        this.#_models[$schemaName] = model
      }
    }
    return this.#database.models
  }
}
// export {
//   FSElement,
//   FSElementContent,
// }