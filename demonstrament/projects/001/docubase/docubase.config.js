const DocubaseConfig = {
  "express": {
    "static": {
      "routes": {
        "/": "distribute/localhost"
      }
    }
  },
  "rollup": {
    "glob": [
      "develop/pages/index.js",
      "develop/pages/.*/index.js"
    ]
  },
  "sass": {
    "glob": [
      "develop/pages/index.scss",
      "develop/pages/.*/index.scss"
    ]
  },
  "ejs": {
    "glob": [
      "develop/pages/index.ejs",
      "develop/pages/.*/index.ejs",
      "develop/pages/index.json",
      "develop/pages/.*/index.json"
    ]
  }
}
export default DocubaseConfig