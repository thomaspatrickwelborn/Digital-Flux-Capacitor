import path from "node:path"
import {
  globSync
} from "glob"
const pagesGlob =  await globSync(
  [
    'develop/pages/index.ejs',
    'develop/pages/.*/index.ejs',
    'develop/pages/index.json',
    'develop/pages/.*/index.json'
  ]
)
const EJSConfig = []
iteratePagesGlob:
for (
  const $pageGlob of pagesGlob
)
{
  const pageGlobParsement = path.parse(
    $pageGlob
  )
  let inputModel = path.join(
    pageGlobParsement.dir,
    pageGlobParsement.name
    .concat(
      '.json'
    ),
  )
  let inputTemplate = path.join(
    pageGlobParsement.dir,
    pageGlobParsement.name
    .concat(
      '.ejs'
    ),
  )
  let outputDir = pageGlobParsement.dir
  .split(
    '/'
  )
  outputDir
  .splice(
    0,
    2,
    'distribute',
    'localhost'
  )
  outputDir = outputDir
  .join(
    '/'
  )
  let outputName = String.prototype.concat(
    pageGlobParsement.name,
    '.html'
  )
  let outputFilePath = path.join(
    outputDir, outputName
  )
  const pageEJSOptions = {
    input: [
      inputModel,
      inputTemplate
    ],
    output: outputFilePath,
    options: {
      root: [
        '/home/thomaspatrickwelborn/Development/Digital-Flux-Capacitor/demonstrament/projects/001/docubase/develop/templates/'
      ],
      localsName: '$data'
    }
  }
  EJSConfig.push(
    pageEJSOptions
  )
}
export default EJSConfig